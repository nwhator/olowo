'use client';

import React from 'react';
import { MascotState } from '@/types';

interface OlowoMascotProps {
  state?: MascotState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatusText?: boolean;
  className?: string;
  onClick?: () => void;
}

export function OlowoMascot({
  state = 'OPERATING',
  size = 'md',
  showStatusText = false,
  className = '',
  onClick,
}: OlowoMascotProps) {
  // Dimension definitions
  const sizeMap = {
    sm: { container: 'w-7 h-7', ring: 'w-6 h-6 border-[2px]', eye: 'w-1 h-1.5', gap: 'gap-1' },
    md: { container: 'w-10 h-10', ring: 'w-9 h-9 border-[2.5px]', eye: 'w-1.5 h-2', gap: 'gap-1.5' },
    lg: { container: 'w-16 h-16', ring: 'w-14 h-14 border-[3.5px]', eye: 'w-2 h-3', gap: 'gap-2' },
    xl: { container: 'w-24 h-24', ring: 'w-20 h-20 border-[4.5px]', eye: 'w-3 h-4', gap: 'gap-3' },
  };

  const currentSize = sizeMap[size];

  // Visual attributes per state
  const config = {
    OPERATING: {
      color: 'border-[#35E0B2]',
      glow: 'shadow-[0_0_15px_rgba(53,224,178,0.3)]',
      eyeColor: 'bg-[#35E0B2]',
      dotColor: 'bg-[#35E0B2]',
      statusText: 'Everything is within policy.',
      badgeText: 'OPERATING',
      badgeClass: 'text-[#35E0B2] bg-[#35E0B2]/10 border-[#35E0B2]/30',
      eyeShape: 'rounded-full',
      eyeAnimation: 'animate-pulse',
    },
    ATTENTION: {
      color: 'border-[#F5B942]',
      glow: 'shadow-[0_0_15px_rgba(245,185,66,0.3)]',
      eyeColor: 'bg-[#F5B942]',
      dotColor: 'bg-[#F5B942]',
      statusText: 'One payment needs your approval.',
      badgeText: 'ATTENTION',
      badgeClass: 'text-[#F5B942] bg-[#F5B942]/10 border-[#F5B942]/30',
      eyeShape: 'rounded-full',
      eyeAnimation: 'animate-bounce',
    },
    BLOCKED: {
      color: 'border-[#EF5B5B]',
      glow: 'shadow-[0_0_15px_rgba(239,91,91,0.3)]',
      eyeColor: 'bg-[#EF5B5B]',
      dotColor: 'bg-[#EF5B5B]',
      statusText: 'I stopped a payment because it violates your mandate.',
      badgeText: 'BLOCKED',
      badgeClass: 'text-[#EF5B5B] bg-[#EF5B5B]/10 border-[#EF5B5B]/30',
      eyeShape: 'rounded-none transform rotate-45',
      eyeAnimation: '',
    },
    PROCESSING: {
      color: 'border-[#4D7CFE]',
      glow: 'shadow-[0_0_15px_rgba(77,124,254,0.3)]',
      eyeColor: 'bg-[#4D7CFE]',
      dotColor: 'bg-[#4D7CFE]',
      statusText: "I'm verifying this invoice.",
      badgeText: 'VERIFYING',
      badgeClass: 'text-[#4D7CFE] bg-[#4D7CFE]/10 border-[#4D7CFE]/30',
      eyeShape: 'rounded-full',
      eyeAnimation: 'animate-pulse',
    },
  }[state];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer hover:opacity-90' : ''} ${className}`}
      title={config.statusText}
    >
      {/* Abstract geometric mascot character derived from the "O" in OLOWO */}
      <div className={`relative flex items-center justify-center ${currentSize.container}`}>
        {/* Outer Ring */}
        <div
          className={`relative flex items-center justify-center rounded-2xl bg-[#F1F5F9] dark:bg-[#0D192C] transition-all duration-300 ${currentSize.ring} ${config.color} ${config.glow}`}
        >
          {/* Subtle inner ambient ring */}
          <div className="absolute inset-1 rounded-xl bg-gradient-to-b from-black/[0.02] dark:from-white/[0.04] to-transparent pointer-events-none" />

          {/* Expressive minimal eyes */}
          <div className={`flex items-center justify-center ${currentSize.gap}`}>
            <span
              className={`block transition-all duration-300 ${currentSize.eye} ${config.eyeColor} ${config.eyeShape} ${config.eyeAnimation}`}
            />
            <span
              className={`block transition-all duration-300 ${currentSize.eye} ${config.eyeColor} ${config.eyeShape} ${config.eyeAnimation}`}
            />
          </div>
        </div>

        {/* Status indicator pip */}
        <span
          className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${config.dotColor} ring-2 ring-white dark:ring-[#08111F]`}
        />
      </div>

      {showStatusText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold tracking-wider text-[#101828] dark:text-white">OLOWO</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono font-medium ${config.badgeClass}`}>
              {config.badgeText}
            </span>
          </div>
          <span className="text-xs text-[#64748B] dark:text-[#8896AB] mt-0.5">{config.statusText}</span>
        </div>
      )}
    </div>
  );
}
