'use client';

import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  Sliders,
  DollarSign,
  AlertTriangle,
  Play,
  Pause,
  CheckCircle2,
  Lock,
  Save,
  Loader2,
} from 'lucide-react';
import { Policy } from '@/types';

interface MandateFormProps {
  initialPolicy: Policy;
  onUpdated?: () => void;
}

export function MandateForm({ initialPolicy, onUpdated }: MandateFormProps) {
  const [policy, setPolicy] = useState<Policy>(initialPolicy);
  const [isSaving, setIsSaving] = useState(false);
  const [isTogglingPause, setIsTogglingPause] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  async function handleTogglePause() {
    setIsTogglingPause(true);
    try {
      const res = await fetch('/api/mandate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_pause' }),
      });
      const data = await res.json();
      if (data.policy) {
        setPolicy(data.policy);
        if (onUpdated) onUpdated();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTogglingPause(false);
    }
  }

  async function handleSaveRules(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/mandate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policy),
      });
      const data = await res.json();
      if (data.policy) {
        setPolicy(data.policy);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        if (onUpdated) onUpdated();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. EMERGENCY KILLSWITCH BANNER (Section 32) */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          policy.isAutonomousPaused
            ? 'bg-[#EF5B5B]/10 border-[#EF5B5B]/40 shadow-[0_0_30px_rgba(239,91,91,0.15)]'
            : 'bg-[#0D192C] border-[#1A2D4C]'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-xl shrink-0 ${
                policy.isAutonomousPaused
                  ? 'bg-[#EF5B5B]/20 text-[#EF5B5B]'
                  : 'bg-[#12223B] text-[#35E0B2]'
              }`}
            >
              {policy.isAutonomousPaused ? (
                <ShieldAlert className="w-6 h-6" />
              ) : (
                <Shield className="w-6 h-6" />
              )}
            </div>

            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {policy.isAutonomousPaused
                  ? 'OLOWO AUTONOMOUS OPERATIONS PAUSED'
                  : 'EMERGENCY OPERATION CONTROL'}
              </h2>
              <p className="text-xs text-[#8896AB] mt-1 max-w-xl leading-relaxed">
                {policy.isAutonomousPaused
                  ? 'OLOWO can continue monitoring your business and generating recommendations, but cannot execute autonomous payments.'
                  : 'Instantly suspend all autonomous payments. When paused, every obligation and invoice requires your explicit manual approval.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTogglePause}
            disabled={isTogglingPause}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-md shrink-0 disabled:opacity-50 ${
              policy.isAutonomousPaused
                ? 'bg-[#35E0B2] hover:bg-[#3ff0c0] text-[#08111F]'
                : 'bg-[#EF5B5B] hover:bg-[#d94848] text-white'
            }`}
          >
            {isTogglingPause ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : policy.isAutonomousPaused ? (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Resume Autonomous Operations</span>
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>PAUSE AUTONOMOUS OPERATIONS</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. MANDATE CONTROLS FORM (Section 31) */}
      <form onSubmit={handleSaveRules} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Limits */}
          <div className="p-6 rounded-2xl bg-[#0D192C] border border-[#1A2D4C] space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#1A2D4C]">
              <DollarSign className="w-4 h-4 text-[#35E0B2]" />
              <h3 className="text-sm font-semibold text-white tracking-tight uppercase font-mono">
                Financial Limits & Spending Authority
              </h3>
            </div>

            {/* Single Payment Limit */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white flex justify-between">
                <span>Autonomous Payment Limit</span>
                <span className="font-mono text-[#35E0B2]">
                  ${policy.autonomousLimit?.toLocaleString()} USDC
                </span>
              </label>
              <p className="text-[11px] text-[#8896AB]">
                Maximum invoice amount OLOWO is authorized to pay without asking you.
              </p>
              <input
                type="number"
                min="0"
                step="50"
                value={policy.autonomousLimit}
                onChange={(e) =>
                  setPolicy({ ...policy, autonomousLimit: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-[#08111F] border border-[#1A2D4C] font-mono text-sm text-white focus:outline-none focus:border-[#35E0B2]"
              />
            </div>

            {/* Daily Autonomous Spending */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white flex justify-between">
                <span>Daily Autonomous Spending</span>
                <span className="font-mono text-[#35E0B2]">
                  ${policy.dailyLimit?.toLocaleString()} USDC
                </span>
              </label>
              <p className="text-[11px] text-[#8896AB]">
                Maximum aggregate autonomous spending permitted in a 24-hour window.
              </p>
              <input
                type="number"
                min="0"
                step="100"
                value={policy.dailyLimit}
                onChange={(e) =>
                  setPolicy({ ...policy, dailyLimit: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-[#08111F] border border-[#1A2D4C] font-mono text-sm text-white focus:outline-none focus:border-[#35E0B2]"
              />
            </div>

            {/* Minimum Treasury Reserve */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white flex justify-between">
                <span>Minimum Treasury Reserve Floor</span>
                <span className="font-mono text-[#EF5B5B]">
                  ${policy.minimumReserve?.toLocaleString()} USDC
                </span>
              </label>
              <p className="text-[11px] text-[#8896AB]">
                Hard liquidity floor. OLOWO will strictly block any payment that would breach this reserve.
              </p>
              <input
                type="number"
                min="0"
                step="500"
                value={policy.minimumReserve}
                onChange={(e) =>
                  setPolicy({ ...policy, minimumReserve: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-[#08111F] border border-[#1A2D4C] font-mono text-sm text-white focus:outline-none focus:border-[#EF5B5B]"
              />
            </div>
          </div>

          {/* Compliance & Verification Rules */}
          <div className="p-6 rounded-2xl bg-[#0D192C] border border-[#1A2D4C] space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#1A2D4C]">
              <Lock className="w-4 h-4 text-[#4D7CFE]" />
              <h3 className="text-sm font-semibold text-white tracking-tight uppercase font-mono">
                Verification & Counterparty Guardrails
              </h3>
            </div>

            {/* New Vendors Rule */}
            <div className="flex items-center justify-between py-2 border-b border-[#1A2D4C]/60">
              <div>
                <span className="text-xs font-medium text-white block">New Vendors</span>
                <span className="text-[11px] text-[#8896AB]">
                  Require owner sign-off on first invoice from newly added counterparty
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={policy.newVendorRequiresApproval}
                  onChange={(e) =>
                    setPolicy({ ...policy, newVendorRequiresApproval: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#12223B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#35E0B2]"></div>
              </label>
            </div>

            {/* Contractor Milestone Rule */}
            <div className="flex items-center justify-between py-2 border-b border-[#1A2D4C]/60">
              <div>
                <span className="text-xs font-medium text-white block">Contractor Payments</span>
                <span className="text-[11px] text-[#8896AB]">
                  Require verified milestone deliverable sign-off before settlement
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={policy.milestoneRequired}
                  onChange={(e) =>
                    setPolicy({ ...policy, milestoneRequired: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#12223B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#35E0B2]"></div>
              </label>
            </div>

            {/* Duplicate Invoices */}
            <div className="flex items-center justify-between py-2 border-b border-[#1A2D4C]/60">
              <div>
                <span className="text-xs font-medium text-white block">Duplicate Invoices</span>
                <span className="text-[11px] text-[#8896AB]">
                  Automatically block duplicate claims and duplicate hashes
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={policy.duplicateProtection}
                  onChange={(e) =>
                    setPolicy({ ...policy, duplicateProtection: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#12223B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#35E0B2]"></div>
              </label>
            </div>

            {/* Flagged Counterparties */}
            <div className="flex items-center justify-between py-2 border-b border-[#1A2D4C]/60">
              <div>
                <span className="text-xs font-medium text-white block">Flagged Counterparties</span>
                <span className="text-[11px] text-[#8896AB]">
                  Strictly block any flagged, sanctioned, or high-risk recipient addresses
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={policy.flaggedCounterpartyProtection}
                  onChange={(e) =>
                    setPolicy({
                      ...policy,
                      flaggedCounterpartyProtection: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#12223B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#35E0B2]"></div>
              </label>
            </div>

            {/* Priority Rules */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <label className="text-[11px] font-mono text-[#5E6E85] block mb-1">
                  PAYROLL PRIORITY
                </label>
                <div className="px-3 py-1.5 rounded-lg bg-[#08111F] border border-[#1A2D4C] text-xs font-semibold text-[#35E0B2]">
                  High (Protected)
                </div>
              </div>
              <div>
                <label className="text-[11px] font-mono text-[#5E6E85] block mb-1">
                  CRITICAL INFRASTRUCTURE
                </label>
                <div className="px-3 py-1.5 rounded-lg bg-[#08111F] border border-[#1A2D4C] text-xs font-semibold text-[#35E0B2]">
                  High (Ring-fenced)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-[#35E0B2] font-mono">
              <CheckCircle2 className="w-4 h-4" />
              Mandate rules updated successfully
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#35E0B2] hover:bg-[#3ff0c0] text-[#08111F] text-xs font-semibold shadow-lg shadow-[#35E0B2]/20 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Mandate Rules</span>
          </button>
        </div>
      </form>
    </div>
  );
}
