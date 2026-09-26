'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { DecisionLogTable } from '@/components/decisions/DecisionLogTable';
import { AuditEvent } from '@/types';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function DecisionsPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/decisions');
      const data = await res.json();
      if (data.auditEvents) setEvents(data.auditEvents);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <AppShell
      title="Decision Log"
      subtitle="Complete, explainable audit trail of every financial action"
    >
      <div className="space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-[#8896AB] gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-[#35E0B2]" />
            <span className="font-mono text-xs">Loading immutable decision log...</span>
          </div>
        ) : (
          <DecisionLogTable events={events} />
        )}
      </div>
    </AppShell>
  );
}
