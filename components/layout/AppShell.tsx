'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Bot,
  Wallet,
} from 'lucide-react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { GlobalStatusBanner } from './GlobalStatusBanner';
import { DemoRunnerModal } from '@/components/demo/DemoRunnerModal';
import { Policy, Treasury, MascotState } from '@/types';

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  onRefresh?: () => void;
}

export function AppShell({ children, title, subtitle, onRefresh }: AppShellProps) {
  const pathname = usePathname();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [treasury, setTreasury] = useState<Treasury | null>(null);
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState<number>(2);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>('OPERATING');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const fetchData = async () => {
    try {
      if (onRefresh) onRefresh();
      const [resTreasury, resMandate, resApprovals] = await Promise.all([
        fetch('/api/treasury'),
        fetch('/api/mandate'),
        fetch('/api/approvals'),
      ]);

      const tData = await resTreasury.json();
      const mData = await resMandate.json();
      const aData = await resApprovals.json();

      if (tData.treasury) setTreasury(tData.treasury);
      if (mData.policy) setPolicy(mData.policy);

      const pending = (aData.approvals || []).filter((a: any) => a.status === 'PENDING').length;
      setPendingApprovalsCount(pending);

      // Derive mascot state
      if (mData.policy?.isAutonomousPaused) {
        setMascotState('BLOCKED');
      } else if (pending > 0) {
        setMascotState('ATTENTION');
      } else {
        setMascotState('OPERATING');
      }
    } catch (e) {
      console.error('Error fetching shell data', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTogglePause = async () => {
    try {
      const res = await fetch('/api/mandate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_pause' }),
      });
      const data = await res.json();
      if (data.policy) {
        setPolicy(data.policy);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      await fetchData();
      window.location.reload();
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F8FA] dark:bg-[#08111F] text-[#101828] dark:text-white flex flex-col transition-colors duration-150 overflow-x-hidden">
      {/* Scripted Hackathon Demo Modal */}
      <DemoRunnerModal
        isOpen={isDemoOpen}
        onClose={() => {
          setIsDemoOpen(false);
          fetchData();
        }}
        onStateChanged={fetchData}
      />

      {/* Global Status Banner (Autonomous Active vs Emergency Paused) */}
      <GlobalStatusBanner
        policy={policy || undefined}
        onTogglePause={handleTogglePause}
      />

      {/* Main Shell Layout */}
      <div className="flex-1 flex w-full relative">
        {/* Left Sidebar (Desktop persistent + Mobile slide-over drawer) */}
        <AppSidebar
          mascotState={mascotState}
          pendingApprovalsCount={pendingApprovalsCount}
          isPaused={policy?.isAutonomousPaused}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        {/* Right Content Area (Full width on mobile) */}
        <div className="flex-1 flex flex-col min-w-0 w-full">
          <AppHeader
            title={title}
            subtitle={subtitle}
            mascotState={mascotState}
            onRunDemo={() => setIsDemoOpen(true)}
            onResetData={handleResetData}
            isResetting={isResetting}
            onStateRefreshed={fetchData}
            onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)}
          />

          <main className="flex-1 p-3.5 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8 pb-24 md:pb-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Thumb friendly for African market traders) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#08111F]/95 backdrop-blur-md border-t border-[#E2E8F0] dark:border-[#1A2D4C] px-2 py-1.5 flex items-center justify-around text-[10px] font-medium shadow-lg transition-colors">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            pathname === '/dashboard'
              ? 'text-[#00A878] dark:text-[#35E0B2] font-bold'
              : 'text-[#64748B] dark:text-[#8896AB]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </Link>

        <Link
          href="/invoices"
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            pathname.startsWith('/invoices')
              ? 'text-[#00A878] dark:text-[#35E0B2] font-bold'
              : 'text-[#64748B] dark:text-[#8896AB]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Waybills</span>
        </Link>

        <Link
          href="/approvals"
          className={`relative flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            pathname === '/approvals'
              ? 'text-[#00A878] dark:text-[#35E0B2] font-bold'
              : 'text-[#64748B] dark:text-[#8896AB]'
          }`}
        >
          <div className="relative">
            <CheckSquare className="w-4 h-4" />
            {pendingApprovalsCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#D97706] text-white text-[8px] flex items-center justify-center font-bold">
                {pendingApprovalsCount}
              </span>
            )}
          </div>
          <span>Approvals</span>
        </Link>

        <Link
          href="/operator"
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            pathname === '/operator'
              ? 'text-[#00A878] dark:text-[#35E0B2] font-bold'
              : 'text-[#64748B] dark:text-[#8896AB]'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Operator</span>
        </Link>

        <Link
          href="/treasury"
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            pathname === '/treasury'
              ? 'text-[#00A878] dark:text-[#35E0B2] font-bold'
              : 'text-[#64748B] dark:text-[#8896AB]'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Money</span>
        </Link>
      </nav>
    </div>
  );
}
