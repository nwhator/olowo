/**
 * Language dictionary and translation helpers for OLOWO.
 * Default is Nigerian Pidgin, with easy switch to Simple English.
 */

export type Language = 'pidgin' | 'simple_english';

export interface Translations {
  tagline: string;
  subtagline: string;
  statusOperating: string;
  statusAttention: string;
  statusBlocked: string;
  statusPaused: string;
  treasuryTitle: string;
  availableTitle: string;
  reservedTitle: string;
  approvalsTitle: string;
  mascotOperating: string;
  mascotAttention: string;
  mascotBlocked: string;
  processInvoiceBtn: string;
  addVendorBtn: string;
  listenVoiceBtn: string;
  listeningVoice: string;
  stopVoice: string;
  explain750: string;
  explain4800: string;
  explainBlocked: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  pidgin: {
    tagline: 'OLOWO dey watch the money. You face your business.',
    subtagline: 'Autonomous finance operator. E dey pay supplier within your rules, lock shop rent, and alert you before money move.',
    statusOperating: 'OLOWO dey active. No shaking, money dey safe.',
    statusAttention: 'One payment dey wait for your say-so!',
    statusBlocked: 'I don stop one payment wey break your rule!',
    statusPaused: 'EMERGENCY PAUSE: You don pause all payment.',
    treasuryTitle: 'TOTAL MONEY WE WE GET',
    availableTitle: 'MONEY WEY DEY FREE TO SPEND',
    reservedTitle: 'SHOP RENT & UPCOMING BILLS (LOCKED)',
    approvalsTitle: 'PAYMENT WEY DEY WAIT FOR YOUR APPROVAL',
    mascotOperating: 'Everything dey waka normal. All policy checks pass.',
    mascotAttention: 'Madam/Oga, see this bill. E pass your $1,000 limit, approve am make I pay.',
    mascotBlocked: 'I don block this payment! Somebody wan collect double money or money no reach.',
    processInvoiceBtn: 'Snap / Check Waybill',
    addVendorBtn: '+ Add Whitelisted Supplier',
    listenVoiceBtn: 'Listen with Man Voice',
    listeningVoice: 'OLOWO dey talk...',
    stopVoice: 'Stop Voice',
    explain750:
      'I don pay Alhaji Sani $750 USDC (~₦1,125,000) for 10 bags of rice. Price correct ($75/bag), waybill verified, goods don land for shop, and your $5,000 shop rent reserve still complete.',
    explain4800:
      'Mama Chinedu Lace send bill of $4,800 USDC (~₦7,200,000) for 5 bales of lace. Waybill correct, but e pass your $1,000 daily limit. I no fit pay until you press Approve.',
    explainBlocked:
      'Warning! Alhaji driver resubmit old waybill for Milestone 4 (INV-1043). Double collection fraud detected. I don block am sharp-sharp!',
  },
  simple_english: {
    tagline: 'OLOWO watches the money. You run the shop.',
    subtagline: 'Autonomous AI finance manager. Pays verified suppliers, safeguards shop rent, and requests approval above your limits.',
    statusOperating: 'OLOWO is actively operating. All systems normal.',
    statusAttention: 'One payment needs your review and approval.',
    statusBlocked: 'Payment stopped because it breaches company rules.',
    statusPaused: 'EMERGENCY PAUSE: All automated payments stopped.',
    treasuryTitle: 'TOTAL TREASURY BALANCE',
    availableTitle: 'DISCRETIONARY FUNDS TO SPEND',
    reservedTitle: 'SHOP RENT & COMMITTED SUPPLIERS (LOCKED)',
    approvalsTitle: 'INVOICES AWAITING YOUR SIGN-OFF',
    mascotOperating: 'Everything is running smoothly within your mandate rules.',
    mascotAttention: 'Attention required: This invoice exceeds your $1,000 autonomous limit.',
    mascotBlocked: 'Payment blocked: Duplicate claim detected or treasury floor breached.',
    processInvoiceBtn: 'Scan Waybill / Invoice',
    addVendorBtn: '+ Add Approved Supplier',
    listenVoiceBtn: 'Listen (Male Voice)',
    listeningVoice: 'Speaking...',
    stopVoice: 'Stop Audio',
    explain750:
      'I paid Alhaji Sani $750 USDC (~₦1,125,000) for 10 bags of rice. The price is verified, delivery arrived at the warehouse, no duplicate claims exist, and treasury reserve is protected.',
    explain4800:
      'Mama Chinedu Lace submitted a bill for $4,800 USDC (~₦7,200,000) for 5 bales of lace. Deliverables are verified, but it exceeds your $1,000 authority. I require your approval before releasing funds.',
    explainBlocked:
      'Warning: Duplicate invoice detected for Milestone 4 (INV-1043). Prevented double payment. Policy strictly blocked transaction.',
  },
};

export function formatDualCurrency(amountUsdc: number, rate = 1500): string {
  const ngn = amountUsdc * rate;
  let ngnFormatted = '';
  if (ngn >= 1_000_000) {
    ngnFormatted = `₦${(ngn / 1_000_000).toFixed(2)}M`;
  } else {
    ngnFormatted = `₦${ngn.toLocaleString()}`;
  }
  return `$${amountUsdc.toLocaleString()} USDC (~${ngnFormatted})`;
}

export function formatDualCurrencyCompact(amountUsdc: number, rate = 1500): { usdc: string; ngn: string } {
  const ngn = amountUsdc * rate;
  let ngnFormatted = '';
  if (ngn >= 1_000_000) {
    ngnFormatted = `₦${(ngn / 1_000_000).toFixed(2)}M`;
  } else {
    ngnFormatted = `₦${ngn.toLocaleString()}`;
  }
  return {
    usdc: `$${amountUsdc.toLocaleString()}`,
    ngn: `~${ngnFormatted}`,
  };
}
