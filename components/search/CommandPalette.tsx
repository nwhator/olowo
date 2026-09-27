'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  FileText,
  CreditCard,
  CheckSquare,
  Wallet,
  ShieldCheck,
  Bot,
  Cpu,
  Languages,
  Volume2,
  FileUp,
  AlertOctagon,
  Play,
  RotateCcw,
  Store,
} from 'lucide-react';
import { useMarket } from '@/components/market/MarketContext';
import { playSound } from '@/lib/sound';

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'ACTIONS' | 'NAVIGATION' | 'SUPPLIERS';
  icon: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
  badge?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenUpload?: () => void;
  onRunDemo?: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onOpenUpload,
  onRunDemo,
}: CommandPaletteProps) {
  const router = useRouter();
  const { language, toggleLanguage, speak, isSpeaking, stopVoice } = useMarket();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const isPidgin = language === 'pidgin';

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        playSound('click');
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or state
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allItems: CommandItem[] = [
    // Fast Actions
    {
      id: 'scan-waybill',
      title: isPidgin ? 'Scan Paper Waybill / Resit' : 'Scan & Verify Waybill',
      subtitle: isPidgin ? 'Upload receipt photo make OLOWO check am' : 'Extract items & evaluate against policy engine',
      category: 'ACTIONS',
      icon: FileUp,
      badge: 'Action',
      onSelect: () => {
        onClose();
        if (onOpenUpload) onOpenUpload();
      },
    },
    {
      id: 'voice-briefing',
      title: isPidgin ? 'Play Man Voice Briefing' : 'Listen to Audio Briefing',
      subtitle: isPidgin ? 'AbeoNeural Nigerian male voice go tell you your money status' : 'Studio neural voice summary of cash & pending invoices',
      category: 'ACTIONS',
      icon: Volume2,
      badge: 'Voice',
      onSelect: () => {
        onClose();
        if (isSpeaking) {
          stopVoice();
        } else {
          speak(
            isPidgin
              ? 'OLOWO dey watch the money! Everything dey waka normal within your rules. Your twelve thousand four hundred dollars treasury dey safe, and five thousand dollars shop rent money dey locked.'
              : 'OLOWO is actively watching your finances. Your twelve thousand four hundred dollars balance is intact, and your five thousand dollar reserve floor is protected.',
            'briefing'
          );
        }
      },
    },
    {
      id: 'toggle-language',
      title: isPidgin ? 'Switch to Simple English 🇬🇧' : 'Switch to Nigerian Pidgin 🇳🇬',
      subtitle: isPidgin ? 'Change system words to English' : 'Change system words to Pidgin for market traders',
      category: 'ACTIONS',
      icon: Languages,
      onSelect: () => {
        playSound('toggle');
        toggleLanguage();
        onClose();
      },
    },
    {
      id: 'run-demo',
      title: 'Run 6-Step Scripted Hackathon Demo',
      subtitle: 'Complete interactive walkthrough of autonomous settlement & policy boundaries',
      category: 'ACTIONS',
      icon: Play,
      badge: 'Demo',
      onSelect: () => {
        onClose();
        if (onRunDemo) onRunDemo();
      },
    },

    // Navigation
    {
      id: 'nav-dashboard',
      title: isPidgin ? 'Market Trader Hub (Dashboard)' : 'Overview Dashboard',
      subtitle: 'Dual Naira/USDC balances, waybill stream, and fast actions',
      category: 'NAVIGATION',
      icon: Store,
      onSelect: () => {
        onClose();
        router.push('/dashboard');
      },
    },
    {
      id: 'nav-invoices',
      title: isPidgin ? 'Waybills & Invoices' : 'Invoices & Waybills',
      subtitle: 'Inspect received bills, duplicate check status, and line items',
      category: 'NAVIGATION',
      icon: FileText,
      onSelect: () => {
        onClose();
        router.push('/invoices');
      },
    },
    {
      id: 'nav-approvals',
      title: isPidgin ? 'Needs Your Say (Approvals)' : 'Pending Approvals',
      subtitle: 'Invoices exceeding autonomous limits waiting for human signature',
      category: 'NAVIGATION',
      icon: CheckSquare,
      onSelect: () => {
        onClose();
        router.push('/approvals');
      },
    },
    {
      id: 'nav-treasury',
      title: isPidgin ? 'Shop Money & USYC Yield (Treasury)' : 'Treasury & USYC Yield',
      subtitle: 'Solvency engine, 5.15% APY yield earnings, and 30-day runway',
      category: 'NAVIGATION',
      icon: Wallet,
      onSelect: () => {
        onClose();
        router.push('/treasury');
      },
    },
    {
      id: 'nav-decisions',
      title: isPidgin ? 'Audit Proofs (Euthyna Replay)' : 'Decision Log & Euthyna Replay',
      subtitle: '4-stage replay time machine: State ➔ Mandate ➔ Reasoning ➔ Arc Hash',
      category: 'NAVIGATION',
      icon: ShieldCheck,
      onSelect: () => {
        onClose();
        router.push('/decisions');
      },
    },
    {
      id: 'nav-infra',
      title: isPidgin ? 'Circle & Arc Network Rails' : 'Circle & Arc Infrastructure',
      subtitle: 'Developer-controlled wallets, Paymaster telemetry, and TestMint faucet',
      category: 'NAVIGATION',
      icon: Cpu,
      onSelect: () => {
        onClose();
        router.push('/infrastructure');
      },
    },
    {
      id: 'nav-operator',
      title: 'OLOWO AI Conversational Operator',
      subtitle: 'Ask natural finance questions grounded in zero hallucination tools',
      category: 'NAVIGATION',
      icon: Bot,
      onSelect: () => {
        onClose();
        router.push('/operator');
      },
    },

    // Suppliers
    {
      id: 'supp-sani',
      title: 'Alhaji Sani Grain Depot (Kano)',
      subtitle: 'Whitelist Grade A • 100 Bags Kano Rice • 0 Disputes',
      category: 'SUPPLIERS',
      icon: Store,
      badge: 'Whitelisted',
      onSelect: () => {
        onClose();
        router.push('/vendors');
      },
    },
    {
      id: 'supp-haulage',
      title: 'Cotonou Haulage Logistics',
      subtitle: 'Cross-border truckers • Cotonou ⇄ Lagos • Mandate $1,000 ceiling',
      category: 'SUPPLIERS',
      icon: CreditCard,
      onSelect: () => {
        onClose();
        router.push('/vendors');
      },
    },
  ];

  const filtered = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filtered[selectedIndex];
      if (selected) {
        playSound('click');
        selected.onSelect();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-[#0D192C] rounded-2xl border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#64748B] dark:text-[#8896AB] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={
              isPidgin
                ? 'Type wetin you dey find: waybill, Alhaji Sani, voice, rent...'
                : 'Search actions, waybills, suppliers, pages (e.g. Sani, voice, USYC)...'
            }
            autoFocus
            className="w-full bg-transparent text-sm text-[#101828] dark:text-white placeholder-[#94A3B8] dark:placeholder-[#5E6E85] focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-[#64748B] hover:text-[#101828] dark:text-[#8896AB] dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#64748B] dark:text-[#8896AB] bg-[#F1F5F9] dark:bg-[#12223B] rounded border border-[#E2E8F0] dark:border-[#1A2D4C]">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#64748B] dark:text-[#8896AB]">
              No matching actions or suppliers found for &quot;{query}&quot;.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const IconComp = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    playSound('click');
                    item.onSelect();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer text-xs transition-colors ${
                    isSelected
                      ? 'bg-[#F1F5F9] dark:bg-[#12223B] text-[#101828] dark:text-white'
                      : 'text-[#475467] dark:text-[#8896AB] hover:bg-[#F8FAFC] dark:hover:bg-[#08111F]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected
                          ? 'bg-[#00A878]/15 text-[#00A878] dark:text-[#35E0B2]'
                          : 'bg-[#F1F5F9] dark:bg-[#0A1424] text-[#64748B] dark:text-[#8896AB]'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="font-semibold truncate text-[#101828] dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#64748B] dark:text-[#8896AB] truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2] border border-[#00A878]/20 font-semibold">
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="p-2.5 px-4 border-t border-[#E2E8F0] dark:border-[#1A2D4C] bg-[#F8FAFC] dark:bg-[#08111F]/60 flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#8896AB] font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="hidden sm:inline">OLOWO Fast Command</span>
        </div>
      </div>
    </div>
  );
}
