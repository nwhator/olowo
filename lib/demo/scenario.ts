import {
  getStore,
  saveStore,
  updateTreasury,
  recordAuditEvent,
  addActivityItem,
  resetToSeedData,
} from '@/lib/db/storage';
import { executeInvoicePayment } from '@/lib/payments/executor';
import { DEMO_STEPS, DemoStep } from './steps';
export { DEMO_STEPS, type DemoStep };

export async function executeDemoStep(stepNumber: number) {
  const step = DEMO_STEPS.find((s) => s.stepNumber === stepNumber);
  if (!step) return null;

  switch (stepNumber) {
    case 1: {
      // Step 1: Incoming revenue
      const store = getStore();
      updateTreasury({
        balance: 12400,
      });
      addActivityItem({
        type: 'PAYMENT',
        iconType: 'check',
        title: 'Received $8,000 USDC',
        subtitle: 'Inbound revenue settled via Arc',
        amount: 8000,
        timeAgo: 'Just now',
        linkUrl: '/treasury',
      });
      break;
    }
    case 2: {
      // Step 2: Milestone verified
      addActivityItem({
        type: 'VERIFICATION',
        iconType: 'check',
        title: 'Milestone 4 Verified',
        subtitle: 'ABC Design deliverable validated against CT-024',
        amount: 750,
        timeAgo: 'Just now',
        linkUrl: '/invoices/inv_1042',
      });
      break;
    }
    case 3: {
      // Step 3: $750 autonomous payment
      await executeInvoicePayment({
        invoiceId: 'inv_1042',
        authorizationType: 'AUTONOMOUS',
      });
      break;
    }
    case 4: {
      // Step 4: AWS obligation reserved
      const store = getStore();
      const ob = store.upcomingObligations.find((o) => o.vendorName === 'AWS');
      if (ob) ob.isReserved = true;
      store.treasury.reserved = 5850;
      store.treasury.available = Math.max(0, store.treasury.balance - 5850);
      saveStore(store);
      addActivityItem({
        type: 'RESERVE',
        iconType: 'reserve',
        title: 'Reserved AWS obligation',
        subtitle: 'Committed $900 for critical infrastructure',
        amount: 900,
        timeAgo: 'Just now',
        linkUrl: '/treasury',
      });
      break;
    }
    case 5: {
      // Step 5: Approval requested
      addActivityItem({
        type: 'APPROVAL_REQUEST',
        iconType: 'alert',
        title: 'Approval requested for $4,800',
        subtitle: 'ABC Design Milestone 5 exceeds autonomous mandate',
        amount: 4800,
        timeAgo: 'Just now',
        linkUrl: '/approvals',
      });
      break;
    }
    case 6: {
      // Step 6: Warning alert
      recordAuditEvent({
        action: 'MANDATE_UPDATED',
        entity: 'Treasury Intelligence',
        entityType: 'TREASURY',
        entityId: 'tr_001',
        decision: 'ALLOWED',
        reason: 'Treasury forecast engine flagged 18-day reserve floor intersection.',
        policyChecks: [],
        authorization: 'SYSTEM',
      });
      break;
    }
  }

  return step;
}
