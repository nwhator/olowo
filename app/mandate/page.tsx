'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { MandateForm } from '@/components/mandate/MandateForm';
import { Policy } from '@/types';
import { Sliders, Shield, Loader2 } from 'lucide-react';

export default function MandatePage() {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPolicy = async () => {
    try {
      const res = await fetch('/api/mandate');
      const data = await res.json();
      if (data.policy) setPolicy(data.policy);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, []);

  return (
    <AppShell
      title="OLOWO Mandate"
      subtitle="Your mandate defines what OLOWO is authorized to do without asking you"
      onRefresh={fetchPolicy}
    >
      <div className="space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
          <div className="p-2 rounded-xl bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#101828] dark:text-white tracking-tight">Financial Authority Mandate</h2>
            <p className="text-xs text-[#64748B] dark:text-[#8896AB]">
              Configure the exact deterministic thresholds, compliance checks, and emergency controls for your AI operator.
            </p>
          </div>
        </div>

        {isLoading || !policy ? (
          <div className="flex items-center justify-center py-20 text-[#64748B] dark:text-[#8896AB] gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-[#00A878] dark:text-[#35E0B2]" />
            <span className="font-mono text-xs">Loading company mandate rules...</span>
          </div>
        ) : (
          <MandateForm initialPolicy={policy} onUpdated={fetchPolicy} />
        )}
      </div>
    </AppShell>
  );
}
