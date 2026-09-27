'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  CheckSquare,
  Users,
  Wallet,
  TrendingUp,
  Bot,
  Sliders,
  ShieldCheck,
  Settings,
  Sparkles,
  Languages,
} from 'lucide-react';
import { OlowoMascot } from '@/components/mascot/OlowoMascot';
import { MascotState } from '@/types';
import { useMarket } from '@/components/market/MarketContext';
import { playSound } from '@/lib/sound';

interface AppSidebarProps {
  mascotState?: MascotState;
  pendingApprovalsCount?: number;
  isPaused?: boolean;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: number;
  badgeColor?: string;
}

interface NavSection {
  title: string | null;
  items: NavItem[];
}

export function AppSidebar({
  mascotState = 'OPERATING',
  pendingApprovalsCount = 2,
  isPaused = false,
}: AppSidebarProps) {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useMarket();

  const isPidgin = language === 'pidgin';

  const navSections: NavSection[] = [
    {
      title: null,
      items: [
        { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: isPidgin ? 'OPERATIONS' : 'OPERATIONS',
      items: [
        {
          label: isPidgin ? 'Waybills & Bills' : 'Invoices',
          href: '/invoices',
          icon: FileText,
        },
        {
          label: isPidgin ? 'Payment Receipts' : 'Payments',
          href: '/payments',
          icon: CreditCard,
        },
        {
          label: isPidgin ? 'Needs Your Say' : 'Approvals',
          href: '/approvals',
          icon: CheckSquare,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          badgeColor: 'bg-[#F5B942]/10 dark:bg-[#F5B942]/20 text-[#D97706] dark:text-[#F5B942] border-[#F5B942]/30',
        },
        {
          label: isPidgin ? 'Suppliers Whitelist' : 'Vendors',
          href: '/vendors',
          icon: Users,
        },
      ],
    },
    {
      title: isPidgin ? 'TREASURY & MONEY' : 'FINANCE',
      items: [
        {
          label: isPidgin ? 'Shop Money & Rent' : 'Treasury',
          href: '/treasury',
          icon: Wallet,
        },
        {
          label: isPidgin ? 'Runway Model' : 'Forecast',
          href: '/forecast',
          icon: TrendingUp,
        },
      ],
    },
    {
      title: isPidgin ? 'AI & MANDATE' : 'INTELLIGENCE',
      items: [
        {
          label: 'OLOWO Operator',
          href: '/operator',
          icon: Bot,
          highlight: true,
        },
        {
          label: isPidgin ? 'Rules & Limits' : 'Mandate',
          href: '/mandate',
          icon: Sliders,
        },
        {
          label: isPidgin ? 'Audit Proof Trail' : 'Decision Log',
          href: '/decisions',
          icon: ShieldCheck,
        },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Settings', href: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#08111F] border-r border-[#E2E8F0] dark:border-[#1A2D4C] flex flex-col shrink-0 min-h-screen transition-colors">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <OlowoMascot state={isPaused ? 'BLOCKED' : mascotState} size="sm" />
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-[#101828] dark:text-white text-lg flex items-center gap-1.5">
              OLOWO
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#00A878]/10 dark:bg-[#35E0B2]/10 text-[#00A878] dark:text-[#35E0B2] border border-[#00A878]/30 dark:border-[#35E0B2]/30 font-semibold">
                AI
              </span>
            </span>
            <span className="text-[11px] text-[#64748B] dark:text-[#8896AB] tracking-wide">
              {isPidgin ? 'Money Operator' : 'Finance Operator'}
            </span>
          </div>
        </Link>
      </div>

      {/* Nav Link Groups */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.title && (
              <div className="px-3 text-[10px] font-mono font-bold text-[#94A3B8] dark:text-[#5E6E85] tracking-wider uppercase mb-2">
                {section.title}
              </div>
            )}

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#F1F5F9] dark:bg-[#12223B] text-[#101828] dark:text-white font-semibold shadow-2xs border border-[#E2E8F0] dark:border-[#1A2D4C]'
                        : 'text-[#475467] dark:text-[#8896AB] hover:text-[#101828] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#0D192C]'
                    } ${item.highlight ? 'border border-[#00A878]/30 dark:border-[#35E0B2]/30' : ''}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent
                        className={`w-4 h-4 ${
                          isActive
                            ? 'text-[#00A878] dark:text-[#35E0B2]'
                            : item.highlight
                            ? 'text-[#00A878] dark:text-[#35E0B2]'
                            : 'text-[#64748B] dark:text-[#8896AB]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded-full border ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Switcher Card */}
      <div className="p-4 border-t border-[#E2E8F0] dark:border-[#1A2D4C] bg-[#F8FAFC] dark:bg-[#08111F]/60 space-y-2">
        <button
          onClick={() => {
            playSound('toggle');
            toggleLanguage();
          }}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#0D192C] text-xs font-semibold text-[#101828] dark:text-white hover:border-[#00A878] transition-colors shadow-2xs"
        >
          <div className="flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-[#00A878] dark:text-[#35E0B2]" />
            <span>{isPidgin ? 'Language: Pidgin 🇳🇬' : 'Language: English 🇬🇧'}</span>
          </div>
          <span className="text-[10px] font-mono text-[#00A878] dark:text-[#35E0B2]">Switch</span>
        </button>

        <div className="text-[11px] text-[#64748B] dark:text-[#8896AB] font-mono text-center">
          {t.tagline}
        </div>
      </div>
    </aside>
  );
}
