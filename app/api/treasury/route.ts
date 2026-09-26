import { NextResponse } from 'next/server';
import { getTreasury, updateTreasury, getUpcomingObligations } from '@/lib/db/storage';
import { calculateTreasuryForecast } from '@/lib/treasury/forecast';
import { getPolicy } from '@/lib/db/storage';

export async function GET() {
  try {
    const treasury = getTreasury();
    const obligations = getUpcomingObligations();
    const policy = getPolicy();
    const forecast = calculateTreasuryForecast(treasury, obligations, policy.minimumReserve);

    return NextResponse.json({
      treasury,
      obligations,
      forecast,
    });
  } catch (error) {
    console.error('Error fetching treasury:', error);
    return NextResponse.json({ error: 'Failed to fetch treasury data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.action === 'deposit' && typeof body.amount === 'number') {
      const current = getTreasury();
      const updated = updateTreasury({ balance: current.balance + body.amount });
      return NextResponse.json({ success: true, treasury: updated });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update treasury' }, { status: 500 });
  }
}
