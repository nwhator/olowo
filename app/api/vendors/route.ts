import { NextResponse } from 'next/server';
import { getVendors, getVendorById, updateVendor, createVendor, recordAuditEvent } from '@/lib/db/storage';

export async function GET() {
  try {
    const vendors = getVendors();
    return NextResponse.json({ vendors });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Create New Vendor
    if (body.action === 'create' || body.name) {
      const { name, category, walletAddress, approved } = body;
      if (!name || !walletAddress) {
        return NextResponse.json({ error: 'Vendor name and wallet address are required' }, { status: 400 });
      }

      const newVendor = createVendor({
        businessId: 'biz_africode_99210',
        name,
        category: category || 'Contractor',
        walletAddress,
        approved: approved !== undefined ? approved : true,
        riskStatus: 'NORMAL',
        totalPaid: 0,
      });

      recordAuditEvent({
        action: 'MANDATE_UPDATED',
        entity: newVendor.name,
        entityType: 'VENDOR',
        entityId: newVendor.id,
        decision: newVendor.approved ? 'ALLOWED' : 'APPROVAL_REQUIRED',
        reason: `New counterparty ${newVendor.name} onboarded with wallet ${walletAddress.slice(0, 8)}... (${newVendor.approved ? 'Approved' : 'Pending'}).`,
        policyChecks: [],
        authorization: 'HUMAN_APPROVED',
      });

      return NextResponse.json({ success: true, vendor: newVendor });
    }

    // Toggle / Update Existing Vendor
    const { vendorId, approved, riskStatus } = body;

    const vendor = getVendorById(vendorId);
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const updated = updateVendor(vendorId, {
      ...(approved !== undefined ? { approved } : {}),
      ...(riskStatus ? { riskStatus } : {}),
    });

    recordAuditEvent({
      action: 'MANDATE_UPDATED',
      entity: vendor.name,
      entityType: 'VENDOR',
      entityId: vendor.id,
      decision: 'MANUAL_APPROVAL',
      reason: `Vendor approval status set to ${approved ? 'APPROVED' : 'UNAPPROVED'}.`,
      policyChecks: [],
      authorization: 'HUMAN_APPROVED',
    });

    return NextResponse.json({ success: true, vendor: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update vendor' }, { status: 500 });
  }
}
