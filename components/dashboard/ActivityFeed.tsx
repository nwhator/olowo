'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  CreditCard,
  Lock,
  AlertTriangle,
  Ban,
  PauseCircle,
  ExternalLink,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ActivityFeedItem } from '@/types';

interface ActivityFeedProps {
  activities: ActivityFeedItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getIcon = (type: ActivityFeedItem['iconType']) => {
    switch (type) {
      case 'check':
        return <CheckCircle2 className="w-4 h-4 text-[#35E0B2]" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-[#35E0B2]" />;
      case 'reserve':
        return <Lock className="w-4 h-4 text-[#4D7CFE]" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-[#F5B942]" />;
      case 'block':
        return <Ban className="w-4 h-4 text-[#EF5B5B]" />;
      case 'pause':
        return <PauseCircle className="w-4 h-4 text-[#EF5B5B]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#35E0B2]" />;
    }
  };

  return (
    <div className="rounded-xl bg-[#0D192C] border border-[#1A2D4C] overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#1A2D4C] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#35E0B2] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#35E0B2]"></span>
          </span>
          <h3 className="text-sm font-semibold text-white tracking-tight">AI Activity Feed</h3>
        </div>
        <span className="text-[11px] font-mono text-[#8896AB]">REAL-TIME LOG</span>
      </div>

      {/* Feed List */}
      <div className="divide-y divide-[#1A2D4C]/60 overflow-y-auto max-h-[380px]">
        {activities.map((item) => {
          const content = (
            <div className="p-4 hover:bg-[#12223B] transition-colors flex items-start gap-3.5 group cursor-pointer">
              {/* Icon avatar */}
              <div className="p-2 rounded-lg bg-[#08111F] border border-[#1A2D4C] shrink-0 mt-0.5">
                {getIcon(item.iconType)}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-xs font-semibold text-white group-hover:text-[#35E0B2] transition-colors truncate">
                    {item.title}
                  </div>
                  <span className="text-[10px] font-mono text-[#5E6E85] shrink-0">
                    {item.timeAgo}
                  </span>
                </div>

                {item.subtitle && (
                  <p className="text-[11px] text-[#8896AB] mt-0.5 leading-relaxed line-clamp-2">
                    {item.subtitle}
                  </p>
                )}

                {item.amount !== undefined && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[11px] font-mono font-medium text-white/90">
                      ${item.amount.toLocaleString()} USDC
                    </span>
                  </div>
                )}
              </div>
            </div>
          );

          return item.linkUrl ? (
            <Link key={item.id} href={item.linkUrl}>
              {content}
            </Link>
          ) : (
            <div key={item.id}>{content}</div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[#1A2D4C] bg-[#0A1424] flex items-center justify-between text-xs text-[#8896AB]">
        <span>Deterministic actions verified</span>
        <Link href="/decisions" className="text-[#35E0B2] hover:underline flex items-center gap-1">
          <span>Full Decision Log</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
