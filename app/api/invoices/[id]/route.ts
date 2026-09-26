import { NextResponse } from 'next/server';
import {
  getInvoiceById,
  getVendorById,
  getContractById,
  getTreasury,
  getPolicy,
} from '@/lib/db/storage';
import { evaluatePaymentPolicy } from '@/lib/policy/engine';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const invoice = getInvoiceById(id);
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const vendor = getVendorById(invoice.vendorId);
    const contract = invoice.contractId ? getContractById(invoice.contractId) : undefined;
    const treasury = getTreasury();
    const policy = getPolicy();

    let evaluation = null;
    if (vendor) {
      evaluation = evaluatePaymentPolicy({
        invoice,
        vendor,
        contract,
        treasury,
        policy,
      });
    }

    return NextResponse.json({
      invoice,
      vendor,
      contract,
      evaluation,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve invoice' }, { status: 500 });
  }
}
