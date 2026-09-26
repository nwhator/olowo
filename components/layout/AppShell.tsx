'use client';

import React, { useState, useEffect } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { GlobalStatusBanner } from './GlobalStatusBanner';
import { DemoRunnerModal } from '@/components/demo/DemoRunnerModal';
import { Policy, Treasury, MascotState } from '@/types';

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [treasury, setTreasury] = useState<Treasury | null>(null);
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState<number>(2);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [mascotState, setMascotState] = useState<MascotState>('OPERATING');

  const fetchData = async () => {
    try {
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
    <div className="min-h-screen bg-[#08111F] text-white flex flex-col">
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
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <AppSidebar
          mascotState={mascotState}
          pendingApprovalsCount={pendingApprovalsCount}
          isPaused={policy?.isAutonomousPaused}
        />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <AppHeader
            title={title}
            subtitle={subtitle}
            mascotState={mascotState}
            onRunDemo={() => setIsDemoOpen(true)}
            onResetData={handleResetData}
            isResetting={isResetting}
          />

          <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
