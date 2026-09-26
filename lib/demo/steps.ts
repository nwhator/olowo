export interface DemoStep {
  stepNumber: number;
  title: string;
  tagline: string;
  description: string;
  mascotState: 'OPERATING' | 'ATTENTION' | 'BLOCKED' | 'PROCESSING';
  mascotMessage: string;
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
      'International client sends $8,000 USDC for Q3 enterprise software delivery. OLOWO detects settlement on Arc network, validates source counterparty, and reconciles the operating treasury.',
    mascotState: 'OPERATING',
    mascotMessage: 'Detected $8,000 USDC incoming payment. Reconciled treasury balance.',
    actionType: 'INCOMING_REVENUE',
    details: {
      amount: 8000,
      entity: 'Global Client Corp',
      metrics: {
        'New Balance': '$12,400 USDC',
        'Available Discretionary': '$6,550 USDC',
        Settlement: 'Arc Network (USDC)',
      },
      statusBadge: 'Treasury Updated',
    },
  },
  {
    stepNumber: 2,
    title: 'Contractor Milestone Verified',
    tagline: 'Milestone 4 Signed Off',
    description:
      'ABC Design submits deliverable for Milestone 4 (Mobile Responsive Flows) under contract CT-024. Technical lead reviews and cryptographic sign-off is logged.',
    mascotState: 'PROCESSING',
    mascotMessage: 'Verifying Milestone 4 deliverables against contract CT-024...',
    actionType: 'MILESTONE_VERIFIED',
    details: {
      amount: 750,
      entity: 'ABC Design',
      metrics: {
        Contract: 'CT-024',
        Milestone: 'Milestone 4',
        'Sign-off': 'Verified & Completed',
      },
      statusBadge: 'Deliverable Verified',
    },
  },
  {
    stepNumber: 3,
    title: '$750 Invoice Autonomous Settlement',
    tagline: '5/5 Policy Checks Passed',
    description:
      'Invoice INV-1042 arrives from ABC Design ($750 USDC). Deterministic policy engine validates vendor whitelist, milestone, duplicate protection, reserve buffer, and $1,000 autonomous mandate. Fully approved without disturbing the owner.',
    mascotState: 'OPERATING',
    mascotMessage: 'Invoice INV-1042 is within mandate. Autonomously paid $750 USDC.',
    actionType: 'AUTONOMOUS_PAYMENT',
    details: {
      amount: 750,
      entity: 'ABC Design',
      metrics: {
        Authorization: 'AUTONOMOUS',
        'Policy Checks': '5/5 Passed',
        'Arc Tx Hash': '0x8f4d92a1...2a91',
        Fee: 'Sponsored ($0 gas)',
      },
      statusBadge: 'Autonomous Payment Sent',
    },
  },
  {
    stepNumber: 4,
    title: 'AWS Cloud Obligation Reserved',
    tagline: 'Critical Infrastructure Liquidity Ring-fenced',
    description:
      'OLOWO monitors upcoming cloud infrastructure bill ($900 USDC due in 5 days). Because critical infrastructure has priority in your mandate, OLOWO locks $900 in reserved capital to ensure 100% uptime.',
    mascotState: 'PROCESSING',
    mascotMessage: 'Reserved $900 USDC for AWS cloud infrastructure.',
    actionType: 'RESERVE_OBLIGATION',
    details: {
      amount: 900,
      entity: 'AWS',
      metrics: {
        'Due In': '5 Days',
        Priority: 'Critical Infrastructure',
        'Reserved Balance': '$5,850 USDC',
      },
      statusBadge: 'Liquidity Ring-fenced',
    },
  },
  {
    stepNumber: 5,
    title: '$4,800 Invoice — Mandate Boundary',
    tagline: 'Authority Exceeded → Human Approval Required',
    description:
      'ABC Design delivers Milestone 5 ($4,800 USDC). Everything verifies: vendor is approved, milestone is finished, duplicate check is clean, treasury is sufficient. But OLOWO recognizes its boundary: $4,800 > $1,000 limit. OLOWO requests your authorization.',
    mascotState: 'ATTENTION',
    mascotMessage:
      'Invoice INV-1044 is fully verified, but exceeds my $1,000 authority. Approval required.',
    actionType: 'APPROVAL_REQUIRED',
    details: {
      amount: 4800,
      entity: 'ABC Design',
      metrics: {
        Invoice: '$4,800 USDC',
        'Autonomous Limit': '$1,000 USDC',
        'AI Recommendation': 'APPROVE',
        Status: 'Awaiting Owner Signature',
      },
      statusBadge: 'Human Approval Required',
    },
  },
  {
    stepNumber: 6,
    title: 'Treasury Runway & Reserve Alert',
    tagline: 'Predictive Financial Intelligence',
    description:
      'OLOWO models 30-day forward cash flow against recurring vendor obligations and burn rate. It alerts you that operating funds may intersect the $5,000 protected reserve in 18 days.',
    mascotState: 'ATTENTION',
    mascotMessage:
      'At current spending rate, available funds may touch your $5,000 reserve in 18 days.',
    actionType: 'TREASURY_WARNING',
    details: {
      amount: 5000,
      entity: 'Treasury Forecast Engine',
      metrics: {
        'Protected Floor': '$5,000 USDC',
        'Runway to Floor': '18 Days',
        'Daily Operating Burn': '$240 USDC/day',
      },
      statusBadge: 'Proactive Alert',
    },
  },
];
