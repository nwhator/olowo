import { NextResponse } from 'next/server';
import { getAuditEvents } from '@/lib/db/storage';

export async function GET() {
  try {
    const auditEvents = getAuditEvents();
    return NextResponse.json({ auditEvents });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch decision log' }, { status: 500 });
  }
}
