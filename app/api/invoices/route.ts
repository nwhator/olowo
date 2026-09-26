import { NextResponse } from 'next/server';
import { getInvoices, getStore } from '@/lib/db/storage';

export async function GET() {
  try {
    const invoices = getInvoices();
    return NextResponse.json({ invoices });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}
