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
    <div className="rounded-xl bg-[#0D192C] border border-[#1A2D4C] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#1A2D4C] flex items-center justify-between bg-[#08111F]">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#35E0B2]" />
          <h3 className="text-sm font-semibold text-white tracking-tight uppercase font-mono">
            Mandate Verification Checklist
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#12223B] border border-[#1A2D4C] text-[#35E0B2]">
            {passedCount} / {checks.length} checks passed
          </span>
        </div>
      </div>

      {/* Checklist items */}
      <div className="divide-y divide-[#1A2D4C]/60">
        {checks.map((item) => {
          const isExpanded = !!expandedKeys[item.key];

          return (
            <div key={item.key} className="transition-colors hover:bg-[#12223B]/40">
              <div
                onClick={() => toggleExpand(item.key)}
                className="px-5 py-3.5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  {item.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#35E0B2] shrink-0" />
                  ) : item.isCritical ? (
                    <XCircle className="w-4 h-4 text-[#EF5B5B] shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[#F5B942] shrink-0" />
                  )}

                  <span
                    className={`text-xs font-medium ${
                      item.passed
                        ? 'text-white'
                        : item.isCritical
                        ? 'text-[#EF5B5B]'
                        : 'text-[#F5B942]'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#5E6E85] hidden sm:inline">
                    {item.passed ? 'VERIFIED' : item.isCritical ? 'BLOCKING' : 'FLAGGED'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#8896AB]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8896AB]" />
                  )}
                </div>
              </div>

              {/* Expandable details */}
              {isExpanded && (
                <div className="px-5 pb-3.5 pt-1 text-xs text-[#8896AB] bg-[#0A1424]/60 border-t border-[#1A2D4C]/40">
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
