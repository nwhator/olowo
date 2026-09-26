export type MascotState = 'OPERATING' | 'ATTENTION' | 'BLOCKED' | 'PROCESSING';

export interface Business {
  id: string;
  name: string;
  createdAt: string;
}

export interface Treasury {
  id: string;
  businessId: string;
  balance: number;           // Total USDC in Circle Treasury
  reserved: number;          // Committed to approved upcoming obligations
  operatingReserve: number;  // $5,000 policy floor
  available: number;         // balance - reserved (discretionary funds)
  currency: 'USDC';
  walletAddress: string;
  network: 'Arc';
  updatedAt: string;
}

export interface Vendor {
  id: string;
  businessId: string;
  name: string;
  category: 'Contractor' | 'Cloud' | 'SaaS' | 'AI' | 'Unknown';
  walletAddress: string;
  approved: boolean;
  riskStatus: 'NORMAL' | 'FLAGGED' | 'PENDING_VERIFICATION';
  createdAt: string;
  contractsCount?: number;
  totalPaid?: number;
}

export interface Milestone {
  id: string;
  number: number;
  title: string;
  amount: number;
  completed: boolean;
  verifiedAt?: string;
}

export interface Contract {
  id: string;
  vendorId: string;
  reference: string; // e.g. "CT-024"
  title: string;
  totalAmount: number;
  currency: 'USDC';
  status: 'ACTIVE' | 'COMPLETED' | 'DRAFT';
  milestones: Milestone[];
}

export type InvoiceStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'AUTONOMOUS_PAID'
  | 'APPROVAL_REQUIRED'
  | 'APPROVED'
  | 'REJECTED'
  | 'BLOCKED';

export type AIDecision = 'ALLOW' | 'APPROVAL_REQUIRED' | 'BLOCK';

export interface VerificationCheckItem {
  key: string;
  label: string;
  passed: boolean;
  details: string;
  isCritical?: boolean;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  vendorId: string;
  vendorName: string;
  contractId?: string;
  contractRef?: string;
  milestoneId?: string;
  milestoneNumber?: number;
  number: string; // e.g. "INV-1042"
  amount: number;
  currency: 'USDC';
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  verificationStatus: 'VERIFIED' | 'FAILED' | 'PENDING';
  aiDecision: AIDecision;
  aiExplanation: string;
  isDuplicate: boolean;
  lineItems: InvoiceLineItem[];
  paymentId?: string;
  transactionHash?: string;
  checksSnapshot: VerificationCheckItem[];
  createdAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  currency: 'USDC';
  status: 'COMPLETED' | 'PENDING' | 'RESERVED' | 'FAILED';
  authorizationType: 'AUTONOMOUS' | 'HUMAN_APPROVED';
  network: 'Arc';
  circleWalletId: string;
  transactionHash: string;
  createdAt: string;
  policyChecksSnapshot: VerificationCheckItem[];
}

export interface Policy {
  id: string;
  businessId: string;
  autonomousLimit: number;       // $1,000 default
  dailyLimit: number;            // $5,000 default
  dailySpent: number;            // today's autonomous total
  minimumReserve: number;        // $5,000 default
  newVendorRequiresApproval: boolean;
  milestoneRequired: boolean;
  duplicateProtection: boolean;
  flaggedCounterpartyProtection: boolean;
  payrollPriority: 'HIGH' | 'MEDIUM' | 'LOW';
  criticalInfraPriority: 'HIGH' | 'MEDIUM' | 'LOW';
  discretionaryPriority: 'HIGH' | 'MEDIUM' | 'LOW' | 'NORMAL';
  isAutonomousPaused: boolean;   // Emergency killswitch
  pausedAt?: string;
  updatedAt: string;
}

export interface Approval {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  vendorName: string;
  vendorId: string;
  amount: number;
  currency: 'USDC';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason: string;
  aiRecommendation: 'APPROVE' | 'REJECT';
  checksSummary: string[];
  requestedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface UpcomingObligation {
  id: string;
  title: string;
  vendorName: string;
  vendorId: string;
  amount: number;
  currency: 'USDC';
  dueDate: string;
  daysUntilDue: number;
  isReserved: boolean;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
}

export interface AuditEvent {
  id: string;
  businessId: string;
  timestamp: string;
  action:
    | 'PAYMENT_EXECUTED'
    | 'APPROVAL_REQUESTED'
    | 'APPROVAL_GRANTED'
    | 'APPROVAL_REJECTED'
    | 'PAYMENT_BLOCKED'
    | 'OBLIGATION_RESERVED'
    | 'MANDATE_UPDATED'
    | 'OPERATIONS_PAUSED'
    | 'OPERATIONS_RESUMED';
  entity: string;
  entityType: 'INVOICE' | 'PAYMENT' | 'VENDOR' | 'MANDATE' | 'TREASURY';
  entityId: string;
  amount?: number;
  decision: 'ALLOWED' | 'APPROVAL_REQUIRED' | 'BLOCKED' | 'MANUAL_APPROVAL' | 'RESERVED';
  reason: string;
  policyChecks: VerificationCheckItem[];
  authorization: 'AUTONOMOUS' | 'HUMAN_APPROVED' | 'SYSTEM';
  transactionHash?: string;
  circleRef?: string;
}

export interface ActivityFeedItem {
  id: string;
  type: 'VERIFICATION' | 'PAYMENT' | 'RESERVE' | 'APPROVAL_REQUEST' | 'BLOCK' | 'PAUSE';
  iconType: 'check' | 'payment' | 'reserve' | 'alert' | 'block' | 'pause';
  title: string;
  subtitle?: string;
  amount?: number;
  timestamp: string;
  timeAgo: string;
  linkUrl?: string;
}

export interface PolicyEvaluationResult {
  decision: AIDecision;
  canPayAutonomously: boolean;
  reasons: string[];
  checks: VerificationCheckItem[];
}

export interface OperatorChatMessage {
  id: string;
  sender: 'user' | 'olowo';
  text: string;
  timestamp: string;
  toolsUsed?: string[];
  verifiedFacts?: string[];
  relatedActionUrl?: string;
}
