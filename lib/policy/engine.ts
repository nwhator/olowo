import {
  Policy,
  Treasury,
  Vendor,
  Contract,
  Invoice,
  PolicyEvaluationResult,
  VerificationCheckItem,
} from '@/types';

export interface EvaluatePaymentParams {
  invoice: Invoice;
  vendor: Vendor;
  contract?: Contract;
  treasury: Treasury;
  policy: Policy;
}

/**
 * Deterministic Backend Policy Engine.
 * Evaluates company policies strictly independent of LLM reasoning.
 * Ensures the LLM cannot bypass financial rules or authorize unpermitted disbursements.
 */
export function evaluatePaymentPolicy({
  invoice,
  vendor,
  contract,
  treasury,
  policy,
}: EvaluatePaymentParams): PolicyEvaluationResult {
  const checks: VerificationCheckItem[] = [];
  const failureReasons: string[] = [];
  const warningReasons: string[] = [];
  const passingReasons: string[] = [];

  // Check 1: Counterparty risk status
  const isFlagged = vendor.riskStatus === 'FLAGGED';
  checks.push({
    key: 'counterparty_risk',
    label: 'Counterparty risk clearance',
    passed: !isFlagged,
    details: isFlagged
      ? 'Counterparty is flagged for high risk or sanctions.'
      : 'Counterparty clear of sanctions and risk flags.',
    isCritical: isFlagged,
  });
  if (isFlagged && policy.flaggedCounterpartyProtection) {
    failureReasons.push('Payment blocked because counterparty is flagged for high risk.');
  }

  // Check 2: Vendor approval status
  const isVendorApproved = vendor.approved;
  checks.push({
    key: 'vendor_approved',
    label: 'Approved vendor in directory',
    passed: isVendorApproved,
    details: isVendorApproved
      ? `${vendor.name} is on the approved company vendor whitelist.`
      : `${vendor.name} is a new or unverified vendor requiring owner approval.`,
    isCritical: !isVendorApproved,
  });
  if (!isVendorApproved && policy.newVendorRequiresApproval) {
    warningReasons.push('Payment requires approval because the recipient is not an approved vendor.');
  }

  // Check 3: Duplicate invoice protection
  const isDuplicate = invoice.isDuplicate;
  checks.push({
    key: 'duplicate_check',
    label: 'Duplicate invoice protection',
    passed: !isDuplicate,
    details: isDuplicate
      ? 'Duplicate invoice detected. Prior payment record found for this invoice or milestone.'
      : 'Invoice is unique. No prior records match this invoice.',
    isCritical: isDuplicate,
  });
  if (isDuplicate && policy.duplicateProtection) {
    failureReasons.push('Payment blocked because this invoice appears to have already been processed.');
  }

  // Check 4: Contract and Milestone Verification (for contractors/vendors with contracts)
  let milestonePassed = true;
  let milestoneDetail = 'Milestone verified or not required for this vendor type.';

  if (vendor.category === 'Contractor' || invoice.contractId) {
    if (!contract) {
      milestonePassed = false;
      milestoneDetail = 'Active contract required for contractor payments but none linked.';
    } else if (invoice.milestoneNumber) {
      const milestone = contract.milestones.find((m) => m.number === invoice.milestoneNumber);
      if (!milestone) {
        milestonePassed = false;
        milestoneDetail = `Milestone ${invoice.milestoneNumber} not found in contract ${contract.reference}.`;
      } else if (!milestone.completed) {
        milestonePassed = false;
        milestoneDetail = `Milestone ${invoice.milestoneNumber} has not been signed off as completed.`;
      } else {
        milestoneDetail = `Contract ${contract.reference} milestone ${invoice.milestoneNumber} verified completed.`;
      }
    }
  }

  checks.push({
    key: 'milestone_verified',
    label: 'Contract milestone verification',
    passed: milestonePassed,
    details: milestoneDetail,
    isCritical: !milestonePassed,
  });

  if (!milestonePassed && policy.milestoneRequired) {
    warningReasons.push('Payment requires human approval because the contractor milestone is unverified.');
  }

  // Check 5: Treasury Solvency
  const isTreasurySufficient = treasury.balance >= invoice.amount;
  checks.push({
    key: 'treasury_sufficient',
    label: 'Treasury balance sufficient',
    passed: isTreasurySufficient,
    details: isTreasurySufficient
      ? `Treasury balance ($${treasury.balance.toLocaleString()} USDC) covers $${invoice.amount.toLocaleString()} USDC.`
      : `Insufficient treasury balance ($${treasury.balance.toLocaleString()} < $${invoice.amount.toLocaleString()}).`,
    isCritical: !isTreasurySufficient,
  });
  if (!isTreasurySufficient) {
    failureReasons.push('Payment blocked because operating treasury balance is insufficient.');
  }

  // Check 6: Minimum Reserve Protection ($5,000)
  const balanceAfterPayment = treasury.balance - invoice.amount;
  const reserveMaintained = balanceAfterPayment >= policy.minimumReserve;
  checks.push({
    key: 'reserve_maintained',
    label: 'Minimum reserve protected',
    passed: reserveMaintained,
    details: reserveMaintained
      ? `Post-payment balance ($${balanceAfterPayment.toLocaleString()} USDC) maintains $${policy.minimumReserve.toLocaleString()} reserve.`
      : `Payment would reduce treasury to $${balanceAfterPayment.toLocaleString()} USDC, breaching $${policy.minimumReserve.toLocaleString()} minimum reserve.`,
    isCritical: !reserveMaintained,
  });
  if (!reserveMaintained) {
    failureReasons.push(
      `Payment blocked because it would reduce the operating balance below the required $${policy.minimumReserve.toLocaleString()} reserve.`
    );
  }

  // Check 7: Autonomous Emergency Pause Control
  const isPaused = policy.isAutonomousPaused;
  checks.push({
    key: 'autonomous_active',
    label: 'Autonomous operations active',
    passed: !isPaused,
    details: !isPaused
      ? 'Autonomous payments enabled by owner mandate.'
      : 'Autonomous execution is currently paused by business owner.',
  });
  if (isPaused) {
    warningReasons.push('Payment requires approval because autonomous operations are paused.');
  }

  // Check 8: Single Payment Autonomous Limit ($1,000)
  const isBelowSingleLimit = invoice.amount <= policy.autonomousLimit;
  checks.push({
    key: 'below_autonomous_limit',
    label: `Below autonomous payment limit ($${policy.autonomousLimit.toLocaleString()})`,
    passed: isBelowSingleLimit,
    details: isBelowSingleLimit
      ? `$${invoice.amount.toLocaleString()} USDC is within autonomous limit ($${policy.autonomousLimit.toLocaleString()} USDC).`
      : `$${invoice.amount.toLocaleString()} USDC exceeds autonomous limit ($${policy.autonomousLimit.toLocaleString()} USDC).`,
  });
  if (!isBelowSingleLimit) {
    warningReasons.push(
      `Payment requires human approval because it exceeds the $${policy.autonomousLimit.toLocaleString()} autonomous limit.`
    );
  }

  // Check 9: Daily Autonomous Spending Limit ($5,000)
  const newDailyTotal = (policy.dailySpent || 0) + invoice.amount;
  const isBelowDailyLimit = newDailyTotal <= policy.dailyLimit;
  checks.push({
    key: 'daily_limit_maintained',
    label: `Within daily autonomous budget ($${policy.dailyLimit.toLocaleString()})`,
    passed: isBelowDailyLimit,
    details: isBelowDailyLimit
      ? `Daily spent would be $${newDailyTotal.toLocaleString()} / $${policy.dailyLimit.toLocaleString()} USDC.`
      : `Payment would push daily autonomous spending to $${newDailyTotal.toLocaleString()}, exceeding $${policy.dailyLimit.toLocaleString()} limit.`,
  });
  if (!isBelowDailyLimit) {
    warningReasons.push('Payment requires approval because it would exceed the daily autonomous spending limit.');
  }

  // Determine Final Decision
  if (failureReasons.length > 0) {
    return {
      decision: 'BLOCK',
      canPayAutonomously: false,
      reasons: failureReasons,
      checks,
    };
  }

  if (warningReasons.length > 0) {
    return {
      decision: 'APPROVAL_REQUIRED',
      canPayAutonomously: false,
      reasons: warningReasons,
      checks,
    };
  }

  passingReasons.push('Vendor approved');
  passingReasons.push('Invoice not duplicated');
  passingReasons.push('Contract verified');
  passingReasons.push('Milestone verified');
  passingReasons.push(`Payment below autonomous limit ($${policy.autonomousLimit.toLocaleString()})`);
  passingReasons.push(`Minimum reserve maintained ($${policy.minimumReserve.toLocaleString()})`);

  return {
    decision: 'ALLOW',
    canPayAutonomously: true,
    reasons: passingReasons,
    checks,
  };
}
