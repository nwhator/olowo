import fs from 'fs';
import path from 'path';
import {
  Business,
  Treasury,
  Vendor,
  Contract,
  Invoice,
  Payment,
  Policy,
  Approval,
  UpcomingObligation,
  AuditEvent,
  ActivityFeedItem,
  MascotState,
} from '@/types';
import { getInitialSeedData } from './seed-data';

export interface OlowoStoreData {
  business: Business;
  treasury: Treasury;
  policy: Policy;
  vendors: Vendor[];
  contracts: Contract[];
  invoices: Invoice[];
  payments: Payment[];
  approvals: Approval[];
  upcomingObligations: UpcomingObligation[];
  auditEvents: AuditEvent[];
  activityFeed: ActivityFeedItem[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'olowo-data.json');

// In-memory cache for fast lookups and SSR
let memoryStore: OlowoStoreData | null = null;

function ensureDataFile(): OlowoStoreData {
  if (memoryStore) {
    return memoryStore;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
      memoryStore = JSON.parse(fileData);
      return memoryStore as OlowoStoreData;
    }
  } catch (error) {
    console.warn('Could not read persistent storage file, using seed data in memory:', error);
  }

  // If no file exists or parse failed, initialize with seed
  const initial = getInitialSeedData();
  memoryStore = initial;
  saveStore(initial);
  return memoryStore;
}

export function saveStore(store: OlowoStoreData): void {
  memoryStore = store;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to olowo-data.json:', err);
  }
}

export function resetToSeedData(): OlowoStoreData {
  const seed = getInitialSeedData();
  saveStore(seed);
  return seed;
}

export function getStore(): OlowoStoreData {
  return ensureDataFile();
}

// Entity helpers
export function getTreasury(): Treasury {
  return getStore().treasury;
}

export function updateTreasury(updates: Partial<Treasury>): Treasury {
  const store = getStore();
  store.treasury = {
    ...store.treasury,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  // Recalculate available funds (available = balance - reserved)
  store.treasury.available = Math.max(0, store.treasury.balance - store.treasury.reserved);
  saveStore(store);
  return store.treasury;
}

export function getPolicy(): Policy {
  return getStore().policy;
}

export function updatePolicy(updates: Partial<Policy>): Policy {
  const store = getStore();
  const wasPaused = store.policy.isAutonomousPaused;
  store.policy = {
    ...store.policy,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // If pause state changed, record audit event
  if (updates.isAutonomousPaused !== undefined && updates.isAutonomousPaused !== wasPaused) {
    recordAuditEvent({
      action: updates.isAutonomousPaused ? 'OPERATIONS_PAUSED' : 'OPERATIONS_RESUMED',
      entity: 'Autonomous Operations',
      entityType: 'MANDATE',
      entityId: store.policy.id,
      decision: updates.isAutonomousPaused ? 'BLOCKED' : 'ALLOWED',
      reason: updates.isAutonomousPaused
        ? 'Business owner engaged the emergency autonomous pause control.'
        : 'Business owner resumed autonomous operations.',
      policyChecks: [],
      authorization: 'HUMAN_APPROVED',
    });
  }

  saveStore(store);
  return store.policy;
}

export function getInvoices(): Invoice[] {
  return getStore().invoices;
}

export function getInvoiceById(id: string): Invoice | undefined {
  return getStore().invoices.find((inv) => inv.id === id || inv.number === id);
}

export function updateInvoice(id: string, updates: Partial<Invoice>): Invoice | null {
  const store = getStore();
  const index = store.invoices.findIndex((inv) => inv.id === id);
  if (index === -1) return null;

  store.invoices[index] = { ...store.invoices[index], ...updates };
  saveStore(store);
  return store.invoices[index];
}

export function getVendors(): Vendor[] {
  return getStore().vendors;
}

export function getVendorById(id: string): Vendor | undefined {
  return getStore().vendors.find((v) => v.id === id);
}

export function updateVendor(id: string, updates: Partial<Vendor>): Vendor | null {
  const store = getStore();
  const index = store.vendors.findIndex((v) => v.id === id);
  if (index === -1) return null;

  store.vendors[index] = { ...store.vendors[index], ...updates };
  saveStore(store);
  return store.vendors[index];
}

export function createVendor(data: Omit<Vendor, 'id' | 'createdAt'>): Vendor {
  const store = getStore();
  const newVendor: Vendor = {
    id: `ven_${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...data,
  };
  store.vendors.push(newVendor);
  saveStore(store);
  return newVendor;
}

export function getContracts(): Contract[] {
  return getStore().contracts;
}

export function getContractById(id: string): Contract | undefined {
  return getStore().contracts.find((c) => c.id === id || c.reference === id);
}

export function getPayments(): Payment[] {
  return getStore().payments;
}

export function getApprovals(): Approval[] {
  return getStore().approvals;
}

export function getApprovalById(id: string): Approval | undefined {
  return getStore().approvals.find((a) => a.id === id);
}

export function getUpcomingObligations(): UpcomingObligation[] {
  return getStore().upcomingObligations;
}

export function toggleReserveObligation(id: string): UpcomingObligation | null {
  const store = getStore();
  const obIndex = store.upcomingObligations.findIndex((o) => o.id === id);
  if (obIndex === -1) return null;

  const ob = store.upcomingObligations[obIndex];
  const willReserve = !ob.isReserved;
  ob.isReserved = willReserve;

  // Recalculate total reserved
  const totalReserved = store.upcomingObligations
    .filter((o) => o.isReserved)
    .reduce((sum, o) => sum + o.amount, 0);

  store.treasury.reserved = totalReserved;
  store.treasury.available = Math.max(0, store.treasury.balance - totalReserved);

  // Add audit and activity
  if (willReserve) {
    recordAuditEvent({
      action: 'OBLIGATION_RESERVED',
      entity: ob.vendorName,
      entityType: 'TREASURY',
      entityId: ob.id,
      amount: ob.amount,
      decision: 'RESERVED',
      reason: `Reserved $${ob.amount.toLocaleString()} USDC for upcoming obligation: ${ob.title}.`,
      policyChecks: [],
      authorization: 'AUTONOMOUS',
    });

    addActivityItem({
      type: 'RESERVE',
      iconType: 'reserve',
      title: `Reserved ${ob.vendorName} obligation`,
      subtitle: `Committed $${ob.amount.toLocaleString()} USDC for ${ob.title}`,
      amount: ob.amount,
      timeAgo: 'Just now',
      linkUrl: '/treasury',
    });
  }

  saveStore(store);
  return ob;
}

export function getAuditEvents(): AuditEvent[] {
  return getStore().auditEvents;
}

export function recordAuditEvent(eventData: Omit<AuditEvent, 'id' | 'businessId' | 'timestamp'>): AuditEvent {
  const store = getStore();
  const newEvent: AuditEvent = {
    id: `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    businessId: store.business.id,
    timestamp: new Date().toISOString(),
    ...eventData,
  };
  store.auditEvents.unshift(newEvent);
  saveStore(store);
  return newEvent;
}

export function getActivityFeed(): ActivityFeedItem[] {
  return getStore().activityFeed;
}

export function addActivityItem(item: Omit<ActivityFeedItem, 'id' | 'timestamp'>): ActivityFeedItem {
  const store = getStore();
  const newItem: ActivityFeedItem = {
    id: `act_${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...item,
  };
  store.activityFeed.unshift(newItem);
  // Keep last 30 activities
  if (store.activityFeed.length > 30) {
    store.activityFeed = store.activityFeed.slice(0, 30);
  }
  saveStore(store);
  return newItem;
}

export function getMascotState(): MascotState {
  const store = getStore();
  if (store.policy.isAutonomousPaused) {
    return 'BLOCKED';
  }
  const pendingApprovals = store.approvals.filter((a) => a.status === 'PENDING');
  if (pendingApprovals.length > 0) {
    return 'ATTENTION';
  }
  return 'OPERATING';
}
