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
} from 'lucide-react';
import { OlowoMascot } from '@/components/mascot/OlowoMascot';
import { MascotState } from '@/types';

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

  const navSections: NavSection[] = [
    {
      title: null,
      items: [
        { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Invoices', href: '/invoices', icon: FileText },
        { label: 'Payments', href: '/payments', icon: CreditCard },
        {
          label: 'Approvals',
          href: '/approvals',
          icon: CheckSquare,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          badgeColor: 'bg-[#F5B942]/20 text-[#F5B942] border-[#F5B942]/30',
        },
        { label: 'Vendors', href: '/vendors', icon: Users },
      ],
    },
    {
      title: 'FINANCE',
      items: [
        { label: 'Treasury', href: '/treasury', icon: Wallet },
        { label: 'Forecast', href: '/forecast', icon: TrendingUp },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { label: 'OLOWO Operator', href: '/operator', icon: Bot, highlight: true },
        { label: 'Mandate', href: '/mandate', icon: Sliders },
        { label: 'Decision Log', href: '/decisions', icon: ShieldCheck },
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
    <aside className="w-64 bg-[#08111F] border-r border-[#1A2D4C] flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#1A2D4C] flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <OlowoMascot state={isPaused ? 'BLOCKED' : mascotState} size="sm" />
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-white text-lg flex items-center gap-1.5">
              OLOWO
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#35E0B2]/10 text-[#35E0B2] border border-[#35E0B2]/30 font-medium">
                AI
              </span>
            </span>
            <span className="text-[11px] text-[#8896AB] tracking-wide">
              Finance Operator
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.title && (
              <h4 className="px-3 text-[10px] font-mono font-semibold text-[#5E6E85] tracking-wider uppercase mb-1.5">
                {section.title}
              </h4>
            )}
            {section.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#12223B] text-white border border-[#1A2D4C] shadow-sm'
                      : 'text-[#8896AB] hover:text-white hover:bg-[#0D192C]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-[#35E0B2]'
                          : item.highlight
                          ? 'text-[#4D7CFE]'
                          : 'text-[#8896AB]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full border ${item.badgeColor || 'bg-white/10 text-white'}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Operator Status Pill in Footer */}
      <div className="p-4 border-t border-[#1A2D4C] bg-[#0A1424]">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isPaused
                  ? 'bg-[#EF5B5B]'
                  : mascotState === 'ATTENTION'
                  ? 'bg-[#F5B942]'
                  : 'bg-[#35E0B2]'
              }`}
            />
            <span className="text-[11px] font-mono text-white/90">
              {isPaused
                ? 'OPERATIONS PAUSED'
                : mascotState === 'ATTENTION'
                ? 'APPROVALS PENDING'
                : 'OPERATING NORMALLY'}
            </span>
          </div>
          <Link
            href="/operator"
            className="text-[11px] text-[#35E0B2] hover:underline flex items-center gap-1"
          >
            <span>Ask</span>
            <Sparkles className="w-2.5 h-2.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
