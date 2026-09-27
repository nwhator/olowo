export interface DemoStep {
  stepNumber: number;
  title: string;
  tagline: string;
  description: string;
  mascotState: 'OPERATING' | 'ATTENTION' | 'BLOCKED' | 'PROCESSING';
  mascotMessage: string;
  audioClipKey?: string;
  marketTitle?: string;
  marketTagline?: string;
  marketDescription?: string;
  marketMascotMessage?: string;
  actionType:
    | 'INCOMING_REVENUE'
    | 'MILESTONE_VERIFIED'
    | 'AUTONOMOUS_PAYMENT'
    | 'RESERVE_OBLIGATION'
    | 'APPROVAL_REQUIRED'
    | 'TREASURY_WARNING';
  details: {
    amount?: number;
    entity?: string;
    metrics?: Record<string, string | number>;
    statusBadge?: string;
  };
}

export const DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: 'Incoming Revenue Detected',
    tagline: 'Client Payment Received',
    description:
      'International buyer sends $8,000 USDC (~₦12,000,000) for grain supply export. OLOWO detects sub-second settlement on Arc network, validates counterparty, and reconciles the store treasury balance.',
    mascotState: 'OPERATING',
    mascotMessage: 'Customer wire confirmed! $8,000 USDC enter treasury safely.',
    audioClipKey: 'briefing',
    marketTitle: 'Customer Payment Landed (₦12,000,000 / $8,000 USDC)',
    marketTagline: 'Mama Ngozi Wholesale Grain Supplies',
    marketDescription:
      'Wholesale buyer in Accra transfers $8,000 USDC for 300 bags of white maize. OLOWO detects settlement on Arc network (<500ms), confirms sender, and reconciles the store balance instantly.',
    marketMascotMessage: 'Customer wire confirmed! $8,000 USDC (about ₦12,000,000) enter shop safely.',
    actionType: 'INCOMING_REVENUE',
    details: {
      amount: 8000,
      entity: 'Global Client Corp / Accra Trader',
      metrics: {
        'New Balance': '$12,400 USDC (~₦18.6M)',
        'Available Funds': '$6,550 USDC (~₦9.8M)',
        Settlement: 'Arc Network (<500ms)',
      },
      statusBadge: 'Treasury Updated',
    },
  },
  {
    stepNumber: 2,
    title: 'Waybill & Delivery Verified',
    tagline: '100 Bags Kano Rice Delivery Verified',
    description:
      'Alhaji Sani Grain Depot delivers 100 bags of parboiled rice to shop. Storekeeper snaps photo of delivery note on WhatsApp. Cryptographic sign-off and PO match are confirmed.',
    mascotState: 'PROCESSING',
    mascotMessage: 'Verifying delivery note against order PO-088. Goods confirmed.',
    marketTitle: 'Alhaji Sani 100 Bags of Kano Rice Verified',
    marketTagline: 'WhatsApp Waybill & Delivery Verified',
    marketDescription:
      'Alhaji Sani Grain Depot delivers 100 bags of top-grade Kano parboiled rice to shop. Storekeeper uploads delivery note photo. WhatsApp waybill is OCR-scanned and verified against order PO-088.',
    marketMascotMessage: 'Waybill photo matched order PO-088. 100 bags of rice complete inside store.',
    actionType: 'MILESTONE_VERIFIED',
    details: {
      amount: 480,
      entity: 'Alhaji Sani Depot',
      metrics: {
        Order: 'PO-088 (Kano Rice)',
        Quantity: '100 Bags (50kg)',
        'Sign-off': 'Waybill Verified',
      },
      statusBadge: 'Waybill Verified',
    },
  },
  {
    stepNumber: 3,
    title: '$480 Supplier Autonomous Settlement',
    tagline: '5/5 Market Safety Checks Passed',
    description:
      'Invoice arrives from Alhaji Sani ($480 USDC / ~₦720,000). Deterministic policy engine validates vendor whitelist, waybill confirmation, duplicate protection, shop rent reserve, and $1,000 autonomous mandate. Settled on Arc in <500ms.',
    mascotState: 'OPERATING',
    mascotMessage: 'Alhaji Sani invoice paid sharp-sharp on Arc network! 100 bags of rice settled.',
    audioClipKey: 'rice_paid',
    marketTitle: 'Alhaji Sani $480 Auto-Payment Settled',
    marketTagline: '5/5 Market Safety Checks Passed',
    marketDescription:
      'Invoice INV-1042 arrives from Alhaji Sani ($480 USDC / ₦720,000). Deterministic policy engine checks supplier list, waybill confirmation, duplicate protection, shop rent reserve, and $1,000 daily limit. Settled on Arc in <500ms with zero operator friction.',
    marketMascotMessage: 'Alhaji Sani money for 100 bags of Kano rice is paid sharp-sharp on Arc network!',
    actionType: 'AUTONOMOUS_PAYMENT',
    details: {
      amount: 480,
      entity: 'Alhaji Sani Depot',
      metrics: {
        Authorization: 'AUTONOMOUS',
        'Safety Checks': '5/5 Passed',
        'Arc Tx Hash': '0x8f4d92a1...2a91',
        Settlement: '<500ms ($0.01 gas)',
      },
      statusBadge: 'Autonomous Payment Sent',
    },
  },
  {
    stepNumber: 4,
    title: 'Shop Rent & Critical Reserve Locked',
    tagline: '₦7.5M ($5,000 USDC) Untouchable Floor',
    description:
      'OLOWO ring-fences $5,000 USDC (~₦7.5M) for shop rent and warehouse obligations. Because premises survival has priority in your mandate, OLOWO locks this floor so no vendor payout can touch it.',
    mascotState: 'PROCESSING',
    mascotMessage: 'Your $5,000 shop rent reserve is locked tight. No vendor can touch this money.',
    audioClipKey: 'rent_safe',
    marketTitle: 'Shop Rent & Critical Reserve Locked',
    marketTagline: '₦7.5M ($5,000 USDC) Untouchable Floor',
    marketDescription:
      'OLOWO calculates landlord shop rent and warehouse dues. Because shop premises are strictly protected in your mandate, OLOWO ring-fences $5,000 USDC untouchable floor so no vendor or runaway payment can touch your lease.',
    marketMascotMessage: 'Your $5,000 shop rent reserve is locked tight. No vendor can touch this money.',
    actionType: 'RESERVE_OBLIGATION',
    details: {
      amount: 5000,
      entity: 'Landlord & Balogun Facilities',
      metrics: {
        'Protected Floor': '$5,000 USDC (~₦7.5M)',
        Priority: 'Mandatory Shop Rent',
        Status: '100% Ring-fenced',
      },
      statusBadge: 'Reserve Locked',
    },
  },
  {
    stepNumber: 5,
    title: 'Cotonou Haulage ($1,400) — Limit Exceeded',
    tagline: 'Authority Exceeded → Human Approval Required',
    description:
      'Cross-border haulage submits $1,400 bill (~₦2,100,000). Goods are at the border and waybill is authentic, but the bill exceeds the $1,000 daily autonomous limit. OLOWO halts payout and asks for Madam/Oga authorization.',
    mascotState: 'ATTENTION',
    mascotMessage: 'This transport bill exceeds your $1,000 limit. Payout paused until you approve!',
    audioClipKey: 'haulage_exceeded',
    marketTitle: 'Cotonou Border Haulage ($1,400) — Limit Exceeded',
    marketTagline: 'Above $1,000 Daily Mandate → Needs Madam Signature',
    marketDescription:
      'Heavy-duty cross-border haulage submits $1,400 bill ($4,800 total batch). Waybill is genuine and goods are verified at the border, but the amount exceeds the $1,000 daily autonomous mandate limit. OLOWO halts automatic payout and sends alert for human owner approval.',
    marketMascotMessage: 'This transport bill exceeds your $1,000 limit. Payout paused until you approve!',
    actionType: 'APPROVAL_REQUIRED',
    details: {
      amount: 1400,
      entity: 'Cotonou Cross-Border Haulage',
      metrics: {
        Invoice: '$1,400 USDC (~₦2.1M)',
        'Autonomous Limit': '$1,000 USDC (~₦1.5M)',
        'AI Check': 'Waybill Valid, Limit Exceeded',
        Action: 'Awaiting Madam Signature',
      },
      statusBadge: 'Approval Required',
    },
  },
  {
    stepNumber: 6,
    title: 'Duplicate Invoice Blocked (Double-Billing Fraud)',
    tagline: 'Zero-Tolerance Policy Protection',
    description:
      'A contractor attempts to resubmit invoice INV-1043 for goods already settled in Step 3. OLOWO cryptographic fingerprinting catches the duplicate instantly, blocks payment, and prevents ₦720,000 ($480 USDC) loss.',
    mascotState: 'BLOCKED',
    mascotMessage: 'Alert! Duplicate invoice detected. OLOWO blocked this payment immediately.',
    audioClipKey: 'double_bill_blocked',
    marketTitle: 'Duplicate Waybill Blocked (Double-Billing Prevented)',
    marketTagline: 'Zero-Tolerance Duplicate Protection',
    marketDescription:
      'Same supplier attempts to resubmit invoice INV-1043 for rice already paid in Step 3. OLOWO cryptographic fingerprinting catches the duplicate instantaneously, blocks payment, logs the violation, and saves ₦720,000 ($480 USDC).',
    marketMascotMessage: 'Alert! Duplicate invoice detected. OLOWO blocked this payment immediately.',
    actionType: 'TREASURY_WARNING',
    details: {
      amount: 480,
      entity: 'Duplicate Risk Engine',
      metrics: {
        'Duplicate Hash': 'MATCH: INV-1042',
        'Money Saved': '$480 USDC (~₦720,000)',
        'Policy Action': 'AUTO_REJECT_FRAUD',
      },
      statusBadge: 'Duplicate Blocked',
    },
  },
];
