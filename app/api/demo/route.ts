import { NextResponse } from 'next/server';
import { executeDemoStep, DEMO_STEPS } from '@/lib/demo/scenario';
import { resetToSeedData, getStore } from '@/lib/db/storage';

export async function GET() {
  return NextResponse.json({ steps: DEMO_STEPS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === 'reset') {
      const freshData = resetToSeedData();
      return NextResponse.json({ success: true, message: 'Data reset to initial state', data: freshData });
    }

    if (body.action === 'step') {
      const stepNumber = Number(body.stepNumber);
      const result = await executeDemoStep(stepNumber);
      return NextResponse.json({ success: true, step: result });
    }

    return NextResponse.json({ error: 'Invalid demo action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Demo action failed' }, { status: 500 });
  }
}
