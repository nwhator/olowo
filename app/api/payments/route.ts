import { NextResponse } from 'next/server';
import { getPayments } from '@/lib/db/storage';
import { executeInvoicePayment } from '@/lib/payments/executor';

export async function GET() {
  try {
    const payments = getPayments();
    return NextResponse.json({ payments });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { invoiceId, authorizationType, approverNotes } = body;

    if (!invoiceId || !authorizationType) {
      return NextResponse.json(
        { error: 'invoiceId and authorizationType are required' },
        { status: 400 }
      );
    }

    const result = await executeInvoicePayment({
      invoiceId,
      authorizationType,
      approverNotes,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, reasons: result.reasons },
        { status: 422 }
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal payment processing error' },
      { status: 500 }
    );
  }
}
