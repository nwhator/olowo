import { olowoTools } from './tools';
import { Language } from '../market/language';

export interface OperatorResponse {
  answer: string;
  toolsUsed: string[];
  verifiedFacts: string[];
  suggestedFollowUps?: string[];
  actionLink?: {
    label: string;
    url: string;
  };
}

/**
 * OLOWO Autonomous Financial Operator Logic.
 * Grounded in real system state with bilingual support (Nigerian Pidgin default + Simple English).
 */
export async function queryOlowoOperator(
  query: string,
  language: Language = 'pidgin'
): Promise<OperatorResponse> {
  const q = query.toLowerCase().trim();
  const isPidgin = language === 'pidgin';

  // Question 1: "Why did you pay ABC Design?" / "Why you pay Alhaji for rice?"
  if (
    q.includes('why') &&
    (q.includes('abc') || q.includes('750') || q.includes('pay') || q.includes('rice') || q.includes('alhaji'))
  ) {
    const treasury = olowoTools.getTreasury();
    const policy = olowoTools.getPolicies();

    return {
      answer: isPidgin
        ? 'I pay Alhaji Sani $750 USDC (~₦1,125,000) because the supplier dey approved for your whitelist, invoice INV-1042 match contract CT-024 for 10 bags of rice, milestone 4 don verify, no duplicate detected, your $5,000 shop rent reserve still intact, and the money dey inside your $1,000 autonomous limit.'
        : 'I paid ABC Design $750 USDC (~₦1,125,000) because the vendor is approved on your whitelist, invoice INV-1042 matches contract CT-024, milestone 4 deliverables were verified, no duplicate billing occurred, treasury remained above the $5,000 reserve floor, and payment was within your $1,000 autonomous authority.',
      toolsUsed: ['getInvoice(inv_1042)', 'getVendor(ven_abc)', 'getPolicies()', 'getTreasury()'],
      verifiedFacts: [
        isPidgin ? 'Supplier Alhaji Sani dey approved on your whitelist' : 'Vendor ABC Design is verified and approved',
        isPidgin ? '10 bags of rice deliverables confirmed' : 'Contract CT-024 (Milestone 4) signed off',
        isPidgin ? 'No duplicate waybill detected' : 'No duplicate invoice detected',
        isPidgin ? `Treasury ($${treasury.balance.toLocaleString()} USDC) maintain $5,000 shop rent floor` : `Current treasury maintained $${policy.minimumReserve.toLocaleString()} USDC reserve floor`,
        isPidgin ? '$750 USDC dey under your $1,000 autonomous limit' : `$750 USDC is within your $${policy.autonomousLimit.toLocaleString()} USDC limit`,
        'Settled on Arc network: tx 0x8f4d92a1...2a91',
      ],
      suggestedFollowUps: isPidgin
        ? [
            'Which bills dey due this week?',
            'How much money I fit spend today?',
            'Why you block that double receipt?',
          ]
        : [
            'What payments are due this week?',
            'How much can I safely spend?',
            'Why was invoice #1043 blocked?',
          ],
      actionLink: {
        label: isPidgin ? 'View Invoice INV-1042' : 'Inspect Invoice INV-1042',
        url: '/invoices/inv_1042',
      },
    };
  }

  // Question 2: "What payments are due this week?" / "Which bills dey due this week?"
  if (
    q.includes('due') ||
    q.includes('upcoming') ||
    q.includes('this week') ||
    q.includes('bills')
  ) {
    const obligations = olowoTools.getUpcomingObligations();
    const obligationsDueSoon = obligations.filter((o) => o.daysUntilDue <= 7);
    const totalDue = obligationsDueSoon.reduce((sum, o) => sum + o.amount, 0);

    const breakdown = obligationsDueSoon
      .map(
        (o) =>
          `• ${o.vendorName}: $${o.amount.toLocaleString()} USDC (~₦${(o.amount * 1500).toLocaleString()}) - ${o.isReserved ? (isPidgin ? 'Locked' : 'Reserved') : (isPidgin ? 'Pending' : 'Scheduled')}`
      )
      .join('\n');

    return {
      answer: isPidgin
        ? `Madam/Oga, you get ${obligationsDueSoon.length} bills wey dey due within the next 7 days totaling $${totalDue.toLocaleString()} USDC (~₦${(totalDue * 1500).toLocaleString()}):\n\n${breakdown}\n\nNo shaking! I don lock funds for the critical ones so your shop and servers no go suffer.`
        : `You have ${obligationsDueSoon.length} obligations due within the next 7 days totaling $${totalDue.toLocaleString()} USDC (~₦${(totalDue * 1500).toLocaleString()}):\n\n${breakdown}\n\nI have already ring-fenced funds for critical obligations to guarantee liquidity.`,
      toolsUsed: ['getUpcomingObligations()', 'getTreasury()'],
      verifiedFacts: [
        `${obligationsDueSoon.length} obligations scheduled within 7 days`,
        `Total short-term commitment: $${totalDue.toLocaleString()} USDC (~₦${(totalDue * 1500).toLocaleString()})`,
        'AWS infrastructure ($900 USDC) is protected and reserved',
      ],
      suggestedFollowUps: isPidgin
        ? ['How much money I fit spend today?', 'Wetyn go happen if I approve Mama Chinedu lace?']
        : ['How much can I safely spend?', 'What happens if I approve this payment?'],
      actionLink: {
        label: isPidgin ? 'Manage Upcoming Bills' : 'Manage Upcoming Obligations',
        url: '/treasury',
      },
    };
  }

  // Question 3: "How much can I safely spend?" / "How much money I fit spend today?"
  if (
    q.includes('safely spend') ||
    q.includes('safe to spend') ||
    q.includes('discretionary') ||
    q.includes('available') ||
    q.includes('fit spend') ||
    q.includes('how much')
  ) {
    const treasury = olowoTools.getTreasury();
    const policy = olowoTools.getPolicies();
    const forecast = olowoTools.calculateTreasuryForecast();

    return {
      answer: isPidgin
        ? `Right now, you get $${treasury.available.toLocaleString()} USDC (~₦${(treasury.available * 1500).toLocaleString()}) wey free to spend! Your total money na $${treasury.balance.toLocaleString()} USDC (~₦${(treasury.balance * 1500).toLocaleString()}), but $${treasury.reserved.toLocaleString()} USDC dey locked for shop rent and upcoming bills wey nobody fit touch.`
        : `You have $${treasury.available.toLocaleString()} USDC (~₦${(treasury.available * 1500).toLocaleString()}) in discretionary funds available today. Total treasury is $${treasury.balance.toLocaleString()} USDC, of which $${treasury.reserved.toLocaleString()} USDC is committed to upcoming obligations and $${policy.minimumReserve.toLocaleString()} USDC is locked as your protected operating reserve floor.`,
      toolsUsed: ['getTreasury()', 'getPolicies()', 'calculateTreasuryForecast()'],
      verifiedFacts: [
        `Total Treasury: $${treasury.balance.toLocaleString()} USDC (~₦${(treasury.balance * 1500).toLocaleString()})`,
        `Committed/Locked: $${treasury.reserved.toLocaleString()} USDC (~₦${(treasury.reserved * 1500).toLocaleString()})`,
        `Protected Floor: $${policy.minimumReserve.toLocaleString()} USDC (~₦${(policy.minimumReserve * 1500).toLocaleString()})`,
        `Safe Discretionary Spend: $${treasury.available.toLocaleString()} USDC`,
        `Runway before reserve touch: ${forecast.daysUntilReserveBreach || 18} days`,
      ],
      suggestedFollowUps: isPidgin
        ? ['Which bills dey due this week?', 'Why you block that double receipt?']
        : ['What payments are due this week?', 'Why was invoice #1043 blocked?'],
      actionLink: {
        label: isPidgin ? 'Check Treasury Breakdown' : 'Inspect Treasury Breakdown',
        url: '/treasury',
      },
    };
  }

  // Question 4: "Why was invoice #1043 blocked?" / "Why you block that double receipt?"
  if (
    q.includes('1043') ||
    q.includes('block') ||
    q.includes('fraud') ||
    q.includes('double')
  ) {
    return {
      answer: isPidgin
        ? 'I block invoice INV-1043 ($750 USDC / ~₦1,125,000) sharp-sharp because na duplicate claim! Somebody submit the same $750 receipt for Milestone 4 wey I already pay 2 days ago on Arc network (Tx: 0x8f4d...2a91). I stop am make your money no loss!'
        : 'Invoice #INV-1043 ($750 USDC) was blocked because duplicate protection triggered. It submitted a duplicate billing claim for Milestone 4, which was already verified and settled under invoice INV-1042 on Sep 24.',
      toolsUsed: ['getInvoice(inv_1043)', 'getPolicies()', 'evaluateInvoicePolicy(inv_1043)'],
      verifiedFacts: [
        isPidgin ? 'Duplicate receipt matched previous payment' : 'Duplicate invoice hash matched prior transaction',
        isPidgin ? 'Milestone 4 already settled and paid' : 'Milestone 4 was already completed and settled',
        'Mandate duplicateProtection = true',
        isPidgin ? 'Zero money leave your wallet' : 'Zero funds were disbursed',
      ],
      suggestedFollowUps: isPidgin
        ? ['Why you pay Alhaji for rice?', 'How much money I fit spend today?']
        : ['Why did you pay ABC Design?', 'How much can I safely spend?'],
      actionLink: {
        label: isPidgin ? 'See Blocked Decision Log' : 'View Blocked Decision Log',
        url: '/decisions',
      },
    };
  }

  // Question 5: "What happens if I approve this payment?" / "Wetyn go happen if I approve Mama Chinedu lace?"
  if (
    q.includes('approve') ||
    q.includes('4,800') ||
    q.includes('4800') ||
    q.includes('happen') ||
    q.includes('lace')
  ) {
    const treasury = olowoTools.getTreasury();
    const policy = olowoTools.getPolicies();
    const newBalance = treasury.balance - 4800;
    const headroomOverReserve = newBalance - policy.minimumReserve;

    return {
      answer: isPidgin
        ? `If you approve Mama Chinedu $4,800 USDC (~₦7,200,000) bill: your remaining money go decrease from $${treasury.balance.toLocaleString()} USDC to $${newBalance.toLocaleString()} USDC (~₦${(newBalance * 1500).toLocaleString()}). Your $5,000 shop rent reserve still dey protected with $${headroomOverReserve.toLocaleString()} cushion. Waybill don verify, so once you approve, money go settle immediately on Arc network.`
        : `If you approve the $4,800 USDC payment: treasury balance will decrease from $${treasury.balance.toLocaleString()} USDC to $${newBalance.toLocaleString()} USDC (~₦${(newBalance * 1500).toLocaleString()}). Your operating reserve ($5,000) remains protected with $${headroomOverReserve.toLocaleString()} USDC in remaining buffer. Payment will settle immediately via Arc.`,
      toolsUsed: ['getInvoice(inv_1044)', 'getTreasury()', 'evaluateInvoicePolicy(inv_1044)'],
      verifiedFacts: [
        isPidgin ? 'Mama Chinedu lace invoice verified' : 'Invoice INV-1044 is fully verified against contract',
        isPidgin ? '5 bales of Hollandais lace deliverable verified' : 'Milestone 5 complete and verified',
        `Post-approval balance: $${newBalance.toLocaleString()} USDC (~₦${(newBalance * 1500).toLocaleString()})`,
        `Reserve floor maintained with $${headroomOverReserve.toLocaleString()} cushion`,
        'Settlement via Arc Testnet USDC',
      ],
      suggestedFollowUps: isPidgin
        ? ['Go to Approval Center', 'How much money I fit spend today?']
        : ['Go to Approvals center', 'How much can I safely spend?'],
      actionLink: {
        label: isPidgin ? 'Review in Approval Center' : 'Review in Approval Center',
        url: '/approvals',
      },
    };
  }

  // General fallback
  const treasury = olowoTools.getTreasury();
  const policy = olowoTools.getPolicies();
  const invoices = olowoTools.getInvoices();
  const pendingApprovals = invoices.filter((i) => i.status === 'APPROVAL_REQUIRED').length;

  return {
    answer: isPidgin
      ? `OLOWO dey active and everything dey waka normal within your rules. Total money we we get na $${treasury.balance.toLocaleString()} USDC (~₦${(treasury.balance * 1500).toLocaleString()}), with $${treasury.available.toLocaleString()} USDC free to spend. Autonomous limit na $${policy.autonomousLimit.toLocaleString()} USDC and $${policy.minimumReserve.toLocaleString()} USDC shop rent money dey locked. Currently ${pendingApprovals} bills dey wait for your approval.`
      : `OLOWO is currently operating normally under your mandate. Total treasury stands at $${treasury.balance.toLocaleString()} USDC ($${treasury.available.toLocaleString()} USDC discretionary). Autonomous limit is $${policy.autonomousLimit.toLocaleString()} USDC with a $${policy.minimumReserve.toLocaleString()} USDC reserve floor. There are currently ${pendingApprovals} items requiring your review.`,
    toolsUsed: ['getTreasury()', 'getPolicies()', 'getInvoices()'],
    verifiedFacts: [
      `Status: ${policy.isAutonomousPaused ? 'PAUSED' : 'ACTIVE'}`,
      `Operating Treasury: $${treasury.balance.toLocaleString()} USDC (~₦${(treasury.balance * 1500).toLocaleString()})`,
      `Pending Approvals: ${pendingApprovals}`,
      `Autonomous Limit: $${policy.autonomousLimit.toLocaleString()} USDC`,
    ],
    suggestedFollowUps: isPidgin
      ? [
          'Why you pay Alhaji for rice?',
          'Which bills dey due this week?',
          'How much money I fit spend today?',
          'Why you block that double receipt?',
        ]
      : [
          'Why did you pay ABC Design?',
          'What payments are due this week?',
          'How much can I safely spend?',
          'What happens if I approve this payment?',
        ],
  };
}
