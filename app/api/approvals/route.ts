import { NextResponse } from 'next/server';
import {
  getApprovals,
  getStore,
  saveStore,
  updateInvoice,
  recordAuditEvent,
  addActivityItem,
} from '@/lib/db/storage';
import { executeInvoicePayment } from '@/lib/payments/executor';

export async function GET() {
  try {
    const approvals = getApprovals();
    return NextResponse.json({ approvals });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch approvals' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { approvalId, action, notes } = body;

    const store = getStore();
    const approval = store.approvals.find((a) => a.id === approvalId);
    if (!approval) {
      return NextResponse.json({ error: 'Approval request not found' }, { status: 404 });
    }

    if (action === 'APPROVE') {
      // Execute payment under HUMAN_APPROVED authority
      const executionResult = await executeInvoicePayment({
        invoiceId: approval.invoiceId,
        authorizationType: 'HUMAN_APPROVED',
        approverNotes: notes || 'Approved manually in Approvals Center',
      });

      if (!executionResult.success) {
        return NextResponse.json(
          { error: executionResult.error, reasons: executionResult.reasons },
          { status: 422 }
        );
      }

      approval.status = 'APPROVED';
      approval.resolvedAt = new Date().toISOString();
      approval.resolvedBy = 'Business Owner';
      saveStore(store);

      recordAuditEvent({
        action: 'APPROVAL_GRANTED',
        entity: approval.vendorName,
        entityType: 'INVOICE',
        entityId: approval.invoiceId,
        amount: approval.amount,
        decision: 'MANUAL_APPROVAL',
        reason: `Business owner granted human approval for invoice ${approval.invoiceNumber} ($${approval.amount.toLocaleString()} USDC).`,
        policyChecks: [],
        authorization: 'HUMAN_APPROVED',
        transactionHash: executionResult.transactionHash,
      });

      return NextResponse.json({
        success: true,
        approval,
        payment: executionResult.payment,
        transactionHash: executionResult.transactionHash,
      });
    } else if (action === 'REJECT') {
      approval.status = 'REJECTED';
      approval.resolvedAt = new Date().toISOString();
      approval.resolvedBy = 'Business Owner';

      updateInvoice(approval.invoiceId, {
        status: 'REJECTED',
      });

      saveStore(store);

      recordAuditEvent({
        action: 'APPROVAL_REJECTED',
        entity: approval.vendorName,
        entityType: 'INVOICE',
        entityId: approval.invoiceId,
        amount: approval.amount,
        decision: 'BLOCKED',
        reason: `Business owner rejected approval request for invoice ${approval.invoiceNumber}. ${notes || ''}`,
        policyChecks: [],
        authorization: 'HUMAN_APPROVED',
      });

      addActivityItem({
        type: 'BLOCK',
        iconType: 'block',
        title: `Rejected ${approval.vendorName} invoice`,
        subtitle: `Disapproved $${approval.amount.toLocaleString()} USDC claim`,
        amount: approval.amount,
        timeAgo: 'Just now',
        linkUrl: `/invoices/${approval.invoiceId}`,
      });

      return NextResponse.json({ success: true, approval });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Approval action failed' }, { status: 500 });
  }
}
