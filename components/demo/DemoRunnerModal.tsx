'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { OlowoMascot } from '@/components/mascot/OlowoMascot';
import { DEMO_STEPS, DemoStep } from '@/lib/demo/steps';

interface DemoRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStateChanged?: () => void;
}

export function DemoRunnerModal({
  isOpen,
  onClose,
  onStateChanged,
}: DemoRunnerModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const currentStep = DEMO_STEPS[currentStepIndex];

  // Auto-play effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && isOpen) {
      timer = setTimeout(() => {
        if (currentStepIndex < DEMO_STEPS.length - 1) {
          handleExecuteStep(currentStepIndex + 1);
        } else {
          setIsRunning(false);
        }
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isRunning, currentStepIndex, isOpen]);

  if (!isOpen) return null;

  async function handleExecuteStep(stepIdx: number) {
    if (stepIdx < 0 || stepIdx >= DEMO_STEPS.length) return;
    setIsExecuting(true);
    setCurrentStepIndex(stepIdx);

    try {
      await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'step',
          stepNumber: DEMO_STEPS[stepIdx].stepNumber,
        }),
      });
      if (onStateChanged) onStateChanged();
    } catch (e) {
      console.error('Demo step failed', e);
    } finally {
      setIsExecuting(false);
    }
  }

  async function handleReset() {
    setIsExecuting(true);
    setIsRunning(false);
    try {
      await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      setCurrentStepIndex(0);
      if (onStateChanged) onStateChanged();
    } catch (e) {
      console.error('Reset failed', e);
    } finally {
      setIsExecuting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#101828] dark:text-white transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between bg-[#F8FAFC] dark:bg-[#08111F]">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#00A878]/10 text-[#00A878] dark:bg-[#35E0B2]/10 dark:text-[#35E0B2] border border-[#00A878]/30 dark:border-[#35E0B2]/30">
              SCRIPTED HACKATHON DEMO
            </span>
            <span className="text-xs text-[#64748B] dark:text-[#8896AB]">
              Step {currentStepIndex + 1} of {DEMO_STEPS.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-[#64748B] dark:text-[#8896AB] hover:text-[#101828] dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-[#F1F5F9] dark:hover:bg-[#12223B]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-[#E2E8F0] dark:bg-[#1A2D4C]">
          <div
            className="h-full bg-gradient-to-r from-[#00A878] to-[#2563EB] dark:from-[#35E0B2] dark:to-[#4D7CFE] transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / DEMO_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          {/* Step Meta */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-medium text-[#2563EB] dark:text-[#4D7CFE] uppercase tracking-wider">
                Event {currentStep.stepNumber} • {currentStep.tagline}
              </span>
              <h2 className="text-xl font-bold text-[#101828] dark:text-white mt-1">{currentStep.title}</h2>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium border bg-[#F8FAFC] dark:bg-[#12223B] text-[#00A878] dark:text-[#35E0B2] border-[#00A878]/30 dark:border-[#35E0B2]/30">
              {currentStep.details.statusBadge}
            </span>
          </div>

          {/* Mascot Voice Box */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center gap-4">
            <OlowoMascot state={currentStep.mascotState} size="lg" />
            <div className="flex-1">
              <div className="text-[11px] font-mono text-[#64748B] dark:text-[#8896AB] uppercase tracking-wider mb-1">
                OLOWO OPERATOR VOICE
              </div>
              <p className="text-sm font-medium text-[#101828] dark:text-white italic">
                &ldquo;{currentStep.mascotMessage}&rdquo;
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#475569] dark:text-[#8896AB] leading-relaxed">
            {currentStep.description}
          </p>

          {/* Live Data Attributes */}
          {currentStep.details.metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0A1424] border border-[#E2E8F0] dark:border-[#1A2D4C]/60">
              {Object.entries(currentStep.details.metrics).map(([key, value]) => (
                <div key={key} className="space-y-0.5">
                  <div className="text-[11px] font-mono text-[#64748B] dark:text-[#5E6E85]">{key}</div>
                  <div className="text-xs font-mono font-semibold text-[#101828] dark:text-white">{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] dark:border-[#1A2D4C] bg-[#F8FAFC] dark:bg-[#08111F] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#0D192C] hover:bg-[#F1F5F9] dark:hover:bg-[#12223B] text-xs font-medium text-[#64748B] dark:text-[#8896AB] hover:text-[#101828] dark:hover:text-white transition-all disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                isRunning
                  ? 'border-[#D97706]/40 bg-[#FFFBEB] text-[#D97706] dark:border-[#F5B942]/40 dark:bg-[#F5B942]/10 dark:text-[#F5B942]'
                  : 'border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#0D192C] text-[#64748B] dark:text-[#8896AB] hover:text-[#101828] dark:hover:text-white'
              }`}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? 'Pause Auto' : 'Auto Play'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExecuteStep(currentStepIndex - 1)}
              disabled={currentStepIndex === 0 || isExecuting}
              className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#0D192C] text-xs font-medium text-[#64748B] dark:text-[#8896AB] hover:text-[#101828] dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStepIndex < DEMO_STEPS.length - 1 ? (
              <button
                onClick={() => handleExecuteStep(currentStepIndex + 1)}
                disabled={isExecuting}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#00A878] hover:bg-[#009166] dark:bg-[#35E0B2] dark:hover:bg-[#3ff0c0] text-white dark:text-[#08111F] text-xs font-semibold shadow-md transition-all disabled:opacity-50"
              >
                <span>Next Event</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#4D7CFE] dark:hover:bg-[#608bfe] text-white text-xs font-semibold shadow-md transition-all"
              >
                Complete Demo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
