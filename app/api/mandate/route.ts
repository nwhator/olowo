import { NextResponse } from 'next/server';
import { getPolicy, updatePolicy, recordAuditEvent, addActivityItem } from '@/lib/db/storage';

export async function GET() {
  try {
    const policy = getPolicy();
    return NextResponse.json({ policy });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch policy' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === 'toggle_pause') {
      const current = getPolicy();
      const newPausedState = !current.isAutonomousPaused;
      const updated = updatePolicy({
        isAutonomousPaused: newPausedState,
        pausedAt: newPausedState ? new Date().toISOString() : undefined,
      });

      addActivityItem({
        type: newPausedState ? 'PAUSE' : 'VERIFICATION',
        iconType: newPausedState ? 'pause' : 'check',
        title: newPausedState
          ? 'Autonomous Operations Paused'
          : 'Autonomous Operations Resumed',
        subtitle: newPausedState
          ? 'Emergency killswitch activated by business owner'
          : 'Mandate restored to active autonomous execution',
        timeAgo: 'Just now',
        linkUrl: '/mandate',
      });

      return NextResponse.json({ success: true, policy: updated });
    }

    // Updating specific policy fields
    const updated = updatePolicy(body);

    recordAuditEvent({
      action: 'MANDATE_UPDATED',
      entity: 'Policy Mandate',
      entityType: 'MANDATE',
      entityId: updated.id,
      decision: 'ALLOWED',
      reason: 'Business owner updated mandate spending and compliance rules.',
      policyChecks: [],
      authorization: 'HUMAN_APPROVED',
    });

    return NextResponse.json({ success: true, policy: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update policy' }, { status: 500 });
  }
}
