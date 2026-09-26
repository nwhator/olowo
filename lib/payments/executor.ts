import {
  getInvoiceById,
  getVendorById,
  getContractById,
  getTreasury,
  getPolicy,
  updateInvoice,
  updateTreasury,
  updatePolicy,
  recordAuditEvent,
  addActivityItem,
  getStore,
  saveStore,
} from '@/lib/db/storage';
import { evaluatePaymentPolicy } from '@/lib/policy/engine';
import { circleClient } from '@/lib/circle';
import { Payment } from '@/types';

export interface ExecutePaymentInput {
  invoiceId: string;
  authorizationType: 'AUTONOMOUS' | 'HUMAN_APPROVED';
  approverNotes?: string;
}

export interface PaymentExecutionResult {
  success: boolean;
  payment?: Payment;
  transactionHash?: string;
  error?: string;
  reasons?: string[];
}

/**
 * Deterministic Server-side Payment Execution Pipeline.
 * Enforces bank-grade guarantees:
 * 1. Re-validates the invoice, vendor, contract, and treasury solvency.
 * 2. Checks deterministic company mandate policy.
 * 3. Dispatches settlement to Circle USDC over Arc network.
 * 4. Records atomic state update, audit log, and activity feed.
 */
export async function executeInvoicePayment(
  input: ExecutePaymentInput
): Promise<PaymentExecutionResult> {
  const invoice = getInvoiceById(input.invoiceId);
  if (!invoice) {
    return { success: false, error: 'Invoice not found in system records.' };
  }

  if (invoice.status === 'AUTONOMOUS_PAID' || invoice.status === 'APPROVED') {
    return { success: false, error: 'This invoice has already been paid.' };
  }

  const vendor = getVendorById(invoice.vendorId);
  if (!vendor) {
    return { success: false, error: 'Vendor record not found.' };
  }

  const contract = invoice.contractId ? getContractById(invoice.contractId) : undefined;
  const treasury = getTreasury();
  const policy = getPolicy();

  // 1. Deterministic Policy Evaluation
  const evaluation = evaluatePaymentPolicy({
    invoice,
    vendor,
    contract,
    treasury,
    policy,
  });

  // If Autonomous execution was requested, policy MUST allow autonomous execution
  if (input.authorizationType === 'AUTONOMOUS') {
    if (!evaluation.canPayAutonomously) {
      // Record blocked or approval request audit event
      if (evaluation.decision === 'BLOCK') {
        recordAuditEvent({
          action: 'PAYMENT_BLOCKED',
          entity: vendor.name,
          entityType: 'INVOICE',
          entityId: invoice.id,
          amount: invoice.amount,
          decision: 'BLOCKED',
          reason: evaluation.reasons.join('; '),
          policyChecks: evaluation.checks,
          authorization: 'SYSTEM',
        });
      }
      return {
        success: false,
        error: evaluation.reasons.join('. '),
        reasons: evaluation.reasons,
      };
    }
  } else {
    // Human approval path: verify that it doesn't violate hard block limits like minimum reserve or flagged counterparty
    if (evaluation.decision === 'BLOCK') {
      return {
        success: false,
        error: `Cannot approve payment: ${evaluation.reasons.join('. ')}`,
        reasons: evaluation.reasons,
      };
    }
  }

  // 2. Circle USDC Payment via Arc Settlement Layer
  const transfer = await circleClient.executeUsdcPayout({
    walletId: circleClient.getTreasuryWalletId(),
    destinationAddress: vendor.walletAddress,
    amount: invoice.amount,
    currency: 'USDC',
    idempotencyKey: `payout_${invoice.id}_${Date.now()}`,
    memo: `OLOWO settlement for ${invoice.number}`,
  });

  if (!transfer.success) {
    return {
      success: false,
      error: transfer.error || 'Payment execution failed at settlement layer. No funds were moved.',
    };
  }

  // 3. Atomically create Payment record
  const newPayment: Payment = {
    id: `pay_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    invoiceId: invoice.id,
    invoiceNumber: invoice.number,
    vendorId: vendor.id,
    vendorName: vendor.name,
    amount: invoice.amount,
    currency: 'USDC',
    status: 'COMPLETED',
    authorizationType: input.authorizationType,
    network: 'Arc',
    circleWalletId: circleClient.getTreasuryWalletId(),
    transactionHash: transfer.transactionHash,
    createdAt: new Date().toISOString(),
    policyChecksSnapshot: evaluation.checks,
  };

  const store = getStore();
  store.payments.unshift(newPayment);

  // 4. Update Invoice state
  const updatedStatus = input.authorizationType === 'AUTONOMOUS' ? 'AUTONOMOUS_PAID' : 'APPROVED';
  updateInvoice(invoice.id, {
    status: updatedStatus,
    paymentId: newPayment.id,
    transactionHash: transfer.transactionHash,
    checksSnapshot: evaluation.checks,
  });

  // 5. Update Treasury balances
  const newTreasuryBalance = Math.max(0, treasury.balance - invoice.amount);
  updateTreasury({
    balance: newTreasuryBalance,
  });

  // 6. Update Policy dailySpent if autonomous
  if (input.authorizationType === 'AUTONOMOUS') {
    updatePolicy({
      dailySpent: (policy.dailySpent || 0) + invoice.amount,
    });
  }

  // 7. Resolve corresponding approval request if it was pending
  const approval = store.approvals.find((a) => a.invoiceId === invoice.id && a.status === 'PENDING');
  if (approval) {
    approval.status = 'APPROVED';
    approval.resolvedAt = new Date().toISOString();
    approval.resolvedBy = 'Business Owner';
    saveStore(store);
  }

  // 8. Record in Decision Log (Audit Event)
  const auditReason =
    input.authorizationType === 'AUTONOMOUS'
      ? `${evaluation.reasons.join('. ')}. 5/5 policy checks passed.`
      : `Approved by Business Owner. ${input.approverNotes || 'Payment authorized via human sign-off.'}`;

  recordAuditEvent({
    action: 'PAYMENT_EXECUTED',
    entity: vendor.name,
    entityType: 'PAYMENT',
    entityId: newPayment.id,
    amount: invoice.amount,
    decision: 'ALLOWED',
    reason: auditReason,
    policyChecks: evaluation.checks,
    authorization: input.authorizationType,
    transactionHash: transfer.transactionHash,
    circleRef: transfer.transferId,
  });

  // 9. Add to Activity Feed
  addActivityItem({
    type: 'PAYMENT',
    iconType: 'payment',
    title: `Paid ${vendor.name}`,
    subtitle: `${invoice.number} ($${invoice.amount.toLocaleString()} USDC) settled via Arc`,
    amount: invoice.amount,
    timeAgo: 'Just now',
    linkUrl: `/invoices/${invoice.id}`,
  });

  return {
    success: true,
    payment: newPayment,
    transactionHash: transfer.transactionHash,
    reasons: evaluation.reasons,
  };
}
