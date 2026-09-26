'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { VerificationCheckItem } from '@/types';

interface VerificationChecklistProps {
  checks: VerificationCheckItem[];
}

export function VerificationChecklist({ checks }: VerificationChecklistProps) {
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const passedCount = checks.filter((c) => c.passed).length;

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] overflow-hidden shadow-xs transition-colors">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between bg-[#F8FAFC] dark:bg-[#08111F]">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2]" />
          <h3 className="text-sm font-bold text-[#101828] dark:text-white tracking-tight uppercase font-mono">
            Mandate Verification Checklist
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-lg bg-white dark:bg-[#12223B] border border-[#E2E8F0] dark:border-[#1A2D4C] text-[#00A878] dark:text-[#35E0B2]">
            {passedCount} / {checks.length} checks passed
          </span>
        </div>
      </div>

      {/* Checklist items */}
      <div className="divide-y divide-[#F1F5F9] dark:divide-[#1A2D4C]/60">
        {checks.map((item) => {
          const isExpanded = !!expandedKeys[item.key];

          return (
            <div key={item.key} className="transition-colors hover:bg-[#F8FAFC] dark:hover:bg-[#12223B]/40">
              <div
                onClick={() => toggleExpand(item.key)}
                className="px-5 py-3.5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  {item.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00A878] dark:text-[#35E0B2] shrink-0" />
                  ) : item.isCritical ? (
                    <XCircle className="w-4 h-4 text-[#DC2626] dark:text-[#EF5B5B] shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[#D97706] dark:text-[#F5B942] shrink-0" />
                  )}

                  <span
                    className={`text-xs font-semibold ${
                      item.passed
                        ? 'text-[#101828] dark:text-white'
                        : item.isCritical
                        ? 'text-[#DC2626] dark:text-[#EF5B5B]'
                        : 'text-[#D97706] dark:text-[#F5B942]'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#94A3B8] dark:text-[#5E6E85] hidden sm:inline">
                    {item.passed ? 'VERIFIED' : item.isCritical ? 'BLOCKING' : 'FLAGGED'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#64748B] dark:text-[#8896AB]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#64748B] dark:text-[#8896AB]" />
                  )}
                </div>
              </div>

              {/* Expandable details */}
              {isExpanded && (
                <div className="px-5 pb-3.5 pt-1 text-xs text-[#64748B] dark:text-[#8896AB] bg-[#F8FAFC] dark:bg-[#0A1424]/60 border-t border-[#F1F5F9] dark:border-[#1A2D4C]/40">
                  <p className="font-mono text-[11px] leading-relaxed">
                    {item.details}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
