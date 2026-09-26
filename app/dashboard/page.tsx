'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { TreasuryMetricCards } from '@/components/dashboard/TreasuryMetricCards';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { ForecastSummaryCard } from '@/components/dashboard/ForecastSummaryCard';
import { RecentOperationsTable } from '@/components/dashboard/RecentOperationsTable';
import { Treasury, ActivityFeedItem, Invoice } from '@/types';
import { ForecastReport } from '@/lib/treasury/forecast';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [treasury, setTreasury] = useState<Treasury | null>(null);
  const [forecast, setForecast] = useState<ForecastReport | null>(null);
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState(2);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const [resTreasury, resInvoices, resApprovals, resFeed] = await Promise.all([
        fetch('/api/treasury'),
        fetch('/api/invoices'),
        fetch('/api/approvals'),
        fetch('/api/decisions'),
      ]);

      const tData = await resTreasury.json();
      const iData = await resInvoices.json();
      const aData = await resApprovals.json();

      if (tData.treasury) setTreasury(tData.treasury);
      if (tData.forecast) setForecast(tData.forecast);
      if (iData.invoices) setInvoices(iData.invoices);

      const pendingCount = (aData.approvals || []).filter((a: any) => a.status === 'PENDING').length;
      setPendingApprovals(pendingCount);

      // Default activity feed
      setActivities([
        {
          id: 'act_1',
          type: 'VERIFICATION',
          iconType: 'check',
          title: 'Verified ABC Design invoice',
          subtitle: 'INV-1044 verified against contract CT-024 (Milestone 5)',
          amount: 4800,
          timestamp: '2026-09-26T08:15:00Z',
          timeAgo: 'Just now',
          linkUrl: '/invoices/inv_1044',
        },
        {
          id: 'act_2',
          type: 'APPROVAL_REQUEST',
          iconType: 'alert',
          title: 'Approval requested',
          subtitle: 'ABC Design invoice exceeds $1,000 autonomous mandate',
          amount: 4800,
          timestamp: '2026-09-26T08:15:30Z',
          timeAgo: '12 min ago',
          linkUrl: '/approvals',
        },
        {
          id: 'act_3',
          type: 'RESERVE',
          iconType: 'reserve',
          title: 'Reserved AWS obligation',
          subtitle: 'Protected $900 for critical infrastructure due in 5 days',
          amount: 900,
          timestamp: '2026-09-26T06:05:00Z',
          timeAgo: '2 hours ago',
          linkUrl: '/treasury',
        },
        {
          id: 'act_4',
          type: 'PAYMENT',
          iconType: 'payment',
          title: 'Paid ABC Design',
          subtitle: 'Milestone 4 settled autonomously via Arc USDC',
          amount: 750,
          timestamp: '2026-09-24T09:42:15Z',
          timeAgo: '2 days ago',
          linkUrl: '/payments',
        },
        {
          id: 'act_5',
          type: 'BLOCK',
          iconType: 'block',
          title: 'Blocked duplicate claim',
          subtitle: 'Rejected duplicate claim for Milestone 4 (INV-1043)',
          amount: 750,
          timestamp: '2026-09-25T11:20:00Z',
          timeAgo: 'Yesterday',
          linkUrl: '/decisions',
        },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AppShell title="Good afternoon." subtitle="OLOWO is operating normally.">
      {isLoading || !treasury || !forecast ? (
        <div className="flex items-center justify-center py-20 text-[#8896AB] gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-[#35E0B2]" />
          <span className="font-mono text-xs">Loading operational state...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section 19: Metric Cards */}
          <TreasuryMetricCards
            treasury={treasury}
            awaitingApprovalCount={pendingApprovals}
          />

          {/* Section 20 & 21: Activity Feed & Treasury Forecast */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityFeed activities={activities} />
            <ForecastSummaryCard forecast={forecast} />
          </div>

          {/* Recent Operations & Invoices */}
          <RecentOperationsTable invoices={invoices} />
        </div>
      )}
    </AppShell>
  );
}
