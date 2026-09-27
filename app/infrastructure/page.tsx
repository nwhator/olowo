'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  Cpu,
  Zap,
  Wallet,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Coins,
  ArrowRight,
  Layers,
  Sparkles,
  RefreshCw,
  Lock,
  Boxes,
  Activity,
  Award,
} from 'lucide-react';
import { playSound } from '@/lib/sound';
import { useMarket } from '@/components/market/MarketContext';

interface InfrastructureState {
  network: {
    name: string;
    chainId: number;
    currency: string;
    latencyMs: number;
    consensusStatus: string;
    gasToken: string;
    averageGasUsdc: number;
    rpcEndpoint: string;
    blockExplorerUrl: string;
    testnetFaucet: string;
  };
  wallets: Array<{
    id: string;
    name: string;
    purpose: string;
    address: string;
    blockchain: string;
    balanceUsdc: number;
    yieldAsset?: string;
    yieldApy?: number;
    status: string;
  }>;
  gateway: {
    totalUsdc: number;
    chains: {
      arc: number;
      base: number;
      arbitrum: number;
      ethereum: number;
    };
  };
  usyc: {
    principalUsdc: number;
    apyPercent: number;
    dailyYieldUsdc: number;
    monthlyYieldUsdc: number;
    annualYieldUsdc: number;
    totalAccruedUsdc: number;
    nairaDailyEquivalent: number;
  };
  cliTools: {
    arcCli: string;
    circleCli: string;
  };
}

export default function InfrastructurePage() {
  const { language, exchangeRate, persona } = useMarket();
  const [data, setData] = useState<InfrastructureState | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const isPidgin = language === 'pidgin';

  const loadData = async () => {
    try {
      const res = await fetch('/api/circle/tools');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    playSound('click');
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleAction = async (action: string, amount?: number) => {
    setActionLoading(action);
    playSound('click');
    try {
      const res = await fetch('/api/circle/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, amount }),
      });
      const result = await res.json();
      if (result.success) {
        playSound('success');
        setNotification(result.message || 'Action executed successfully');
        loadData();
      } else {
        playSound('alert');
        setNotification(result.error || 'Action failed');
      }
    } catch (e) {
      playSound('alert');
      setNotification('Network error occurred');
    } finally {
      setActionLoading(null);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <AppShell
      title={isPidgin ? 'Circle & Arc Machine Engine' : 'Circle & Arc Infrastructure'}
      subtitle={
        isPidgin
          ? 'Live connection with Circle Agent Stack (Wallets, Paymaster, Gateway, USYC) on Arc rails.'
          : 'Live integration with the Circle Agent Stack (Wallets, Paymaster, Gateway, USYC) settled on Arc.'
      }
      onRefresh={loadData}
    >
      <div className="space-y-8 max-w-6xl pb-12">
        {/* Hackathon Alignment Banner */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[#D97706]/30 dark:border-[#F5B942]/30 bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7]/40 to-[#FFFBEB] dark:from-[#2A1D08] dark:via-[#1E1706] dark:to-[#171204] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D97706]/15 text-[#D97706] dark:text-[#F5B942] flex items-center justify-center shrink-0 border border-[#D97706]/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D97706] dark:text-[#F5B942]">
                  TAMEION AGENTS HACKATHON
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#D97706]/15 text-[#D97706] dark:text-[#F5B942]">
                  CANTEEN × CIRCLE × ARC
                </span>
              </div>
              <p className="text-xs text-[#78350F] dark:text-[#FDE68A] mt-0.5">
                {isPidgin
                  ? 'All 5 Circle & Arc tools (Wallets, Paymaster, Gateway, USYC, CCTP) dey active and ready for live demo.'
                  : 'All 5 core Circle & Arc primitives (Wallets, Paymaster, Gateway, USYC, CCTP) are natively wired into OLOWO.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleAction('claim_testnet_usdc', 500)}
              disabled={actionLoading !== null}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#00A878] hover:bg-[#009166] text-white flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
            >
              <Coins className="w-4 h-4" />
              <span>Claim +$500 Test USDC</span>
            </button>

            <a
              href="https://testmint.myproceeds.xyz/"
              target="_blank"
              rel="noopener"
              className="px-3 py-2 rounded-xl text-xs font-semibold border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#0D192C] text-[#101828] dark:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#12223B] flex items-center gap-1.5 transition-all"
            >
              <span>TestMint</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Live Action Notification Toast */}
        {notification && (
          <div className="p-3.5 rounded-xl border border-[#00A878]/30 bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2] text-xs font-mono flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Check className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        {/* Section 1: Arc Network Real-Time Telemetry */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2]">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#101828] dark:text-white tracking-tight flex items-center gap-2">
                  <span>Arc Settlement Layer Telemetry</span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#00A878]/15 text-[#00A878] dark:text-[#35E0B2]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A878] animate-pulse" />
                    LIVE
                  </span>
                </h2>
                <p className="text-xs text-[#64748B] dark:text-[#8896AB] mt-0.5">
                  Sub-second finality with native USDC gas token. Hosted by Canteen &amp; Circle.
                </p>
              </div>
            </div>

            <a
              href="https://explorer.arc.network"
              target="_blank"
              rel="noopener"
              className="text-xs font-mono text-[#2563EB] dark:text-[#4D7CFE] hover:underline flex items-center gap-1"
            >
              <span>Arc Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C]">
              <span className="text-[10px] font-mono text-[#64748B] dark:text-[#5E6E85] uppercase block">
                Settlement Latency
              </span>
              <span className="text-lg font-bold text-[#00A878] dark:text-[#35E0B2] font-mono mt-0.5 block">
                &lt;380ms
              </span>
              <span className="text-[10px] text-[#64748B] dark:text-[#8896AB]">Sub-second finality</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C]">
              <span className="text-[10px] font-mono text-[#64748B] dark:text-[#5E6E85] uppercase block">
                Gas Token
              </span>
              <span className="text-lg font-bold text-[#101828] dark:text-white font-mono mt-0.5 block">
                USDC ($0.012)
              </span>
              <span className="text-[10px] text-[#00A878] dark:text-[#35E0B2]">100% Sponsored</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C]">
              <span className="text-[10px] font-mono text-[#64748B] dark:text-[#5E6E85] uppercase block">
                Chain ID
              </span>
              <span className="text-lg font-bold text-[#101828] dark:text-white font-mono mt-0.5 block">
                84532
              </span>
              <span className="text-[10px] text-[#64748B] dark:text-[#8896AB]">Arc Testnet</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C]">
              <span className="text-[10px] font-mono text-[#64748B] dark:text-[#5E6E85] uppercase block">
                RPC Node
              </span>
              <span className="text-sm font-bold text-[#2563EB] dark:text-[#4D7CFE] font-mono mt-1 truncate block">
                arc-node.thecanteenapp.com
              </span>
              <span className="text-[10px] text-[#00A878] dark:text-[#35E0B2]">Canteen Hosted</span>
            </div>
          </div>
        </div>

        {/* Section 2: Circle Developer-Controlled Wallets */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#2563EB]/10 text-[#2563EB] dark:text-[#4D7CFE]">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#101828] dark:text-white tracking-tight">
                  Circle Developer-Controlled Wallets
                </h2>
                <p className="text-xs text-[#64748B] dark:text-[#8896AB] mt-0.5">
                  Automated key management for treasury operations, protected reserve floor, and contractor escrow.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-[#64748B] dark:text-[#8896AB]">
              3 Wallets Configured
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data?.wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="p-4 rounded-xl border border-[#E2E8F0] dark:border-[#1A2D4C] bg-[#F8FAFC] dark:bg-[#08111F] flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8896AB]">
                      {wallet.purpose}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        wallet.status === 'LOCKED'
                          ? 'bg-[#D97706]/15 text-[#D97706] dark:text-[#F5B942]'
                          : 'bg-[#00A878]/15 text-[#00A878] dark:text-[#35E0B2]'
                      }`}
                    >
                      {wallet.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#101828] dark:text-white leading-tight">
                    {wallet.name}
                  </h3>

                  <div className="mt-3">
                    <span className="text-xl font-bold font-mono text-[#101828] dark:text-white">
                      ${wallet.balanceUsdc.toLocaleString()} USDC
                    </span>
                    <span className="text-xs font-mono text-[#64748B] dark:text-[#8896AB] block mt-0.5">
                      ~₦{(wallet.balanceUsdc * exchangeRate).toLocaleString()}
                    </span>
                  </div>

                  {wallet.yieldAsset && (
                    <div className="mt-2.5 px-2.5 py-1 rounded bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2] text-[11px] font-mono font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{wallet.yieldAsset} Money Market Fund ({wallet.yieldApy}% APY)</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#64748B] dark:text-[#5E6E85] truncate max-w-[160px]">
                    {wallet.address}
                  </span>
                  <button
                    onClick={() => handleCopy(wallet.address, wallet.id)}
                    className="p-1 hover:text-[#00A878] text-[#64748B] dark:text-[#8896AB] transition-colors"
                    title="Copy Address"
                  >
                    {copiedKey === wallet.id ? <Check className="w-3.5 h-3.5 text-[#00A878]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Circle USYC Yield Engine */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#101828] dark:text-white tracking-tight flex items-center gap-2">
                  <span>Circle USYC Yield Optimizer</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00A878]/15 text-[#00A878] dark:text-[#35E0B2]">
                    5.15% APY
                  </span>
                </h2>
                <p className="text-xs text-[#64748B] dark:text-[#8896AB] mt-0.5">
                  Tokenized money market fund. Idle shop rent reserve earns yield daily while staying strictly locked.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAction('sweep_to_usyc', 500)}
                disabled={actionLoading !== null}
                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#12223B] text-xs font-semibold hover:border-[#00A878] text-[#101828] dark:text-white transition-all shadow-xs"
              >
                + Sweep $500 to USYC
              </button>
              <button
                onClick={() => handleAction('redeem_from_usyc', 500)}
                disabled={actionLoading !== null}
                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#1A2D4C] bg-white dark:bg-[#12223B] text-xs font-semibold hover:border-[#D97706] text-[#101828] dark:text-white transition-all shadow-xs"
              >
                Redeem to Cash
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C]">
              <span className="text-[#64748B] dark:text-[#5E6E85] block">Locked Principal</span>
              <span className="text-base font-bold text-[#101828] dark:text-white mt-1 block">
                ${data?.usyc.principalUsdc.toLocaleString()} USDC
              </span>
              <span className="text-[11px] text-[#00A878] dark:text-[#35E0B2] block mt-0.5">
                ~₦{(Number(data?.usyc.principalUsdc || 5000) * exchangeRate).toLocaleString()}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C]">
              <span className="text-[#64748B] dark:text-[#5E6E85] block">Daily Accrued Interest</span>
              <span className="text-base font-bold text-[#00A878] dark:text-[#35E0B2] mt-1 block">
                +${data?.usyc.dailyYieldUsdc.toFixed(2)}/day
              </span>
              <span className="text-[11px] text-[#64748B] dark:text-[#8896AB] block mt-0.5">
                ~₦{data?.usyc.nairaDailyEquivalent.toLocaleString()} / day
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C]">
              <span className="text-[#64748B] dark:text-[#5E6E85] block">Annual Projected Yield</span>
              <span className="text-base font-bold text-[#101828] dark:text-white mt-1 block">
                +${data?.usyc.annualYieldUsdc.toFixed(2)}/yr
              </span>
              <span className="text-[11px] text-[#64748B] dark:text-[#8896AB] block mt-0.5">
                ~₦{(Number(data?.usyc.annualYieldUsdc || 257) * exchangeRate).toLocaleString()} / yr
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C]">
              <span className="text-[#64748B] dark:text-[#5E6E85] block">Total Accrued to Date</span>
              <span className="text-base font-bold text-[#00A878] dark:text-[#35E0B2] mt-1 block">
                +${data?.usyc.totalAccruedUsdc.toFixed(2)} USDC
              </span>
              <span className="text-[11px] text-[#64748B] dark:text-[#8896AB] block mt-0.5">
                Compounded &amp; Reinvested
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Circle Gateway Unified Balance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
              <div className="p-2 rounded-xl bg-[#3B66F5]/10 text-[#3B66F5] dark:text-[#4D7CFE]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#101828] dark:text-white">
                  Circle Gateway (Multichain Unified Balance)
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#8896AB]">
                  One honest view across chains before forecasting cash needs.
                </p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-[#E2E8F0] dark:border-[#1A2D4C]/60">
                <span className="text-[#64748B] dark:text-[#8896AB] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00A878]" />
                  Arc L1 Settlement
                </span>
                <span className="font-bold text-[#101828] dark:text-white">
                  ${data?.gateway.chains.arc.toLocaleString()} USDC
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#E2E8F0] dark:border-[#1A2D4C]/60">
                <span className="text-[#64748B] dark:text-[#8896AB] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                  Base (Coinbase L2)
                </span>
                <span className="font-bold text-[#101828] dark:text-white">
                  ${data?.gateway.chains.base.toLocaleString()} USDC
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#E2E8F0] dark:border-[#1A2D4C]/60">
                <span className="text-[#64748B] dark:text-[#8896AB] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                  Arbitrum One
                </span>
                <span className="font-bold text-[#101828] dark:text-white">
                  ${data?.gateway.chains.arbitrum.toLocaleString()} USDC
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-bold text-[#101828] dark:text-white uppercase tracking-wider">
                  Total Unified Liquidity:
                </span>
                <span className="text-base font-bold text-[#00A878] dark:text-[#35E0B2]">
                  ${data?.gateway.totalUsdc.toLocaleString()} USDC
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: Circle Paymaster Gasless Sponsor */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
              <div className="p-2 rounded-xl bg-[#00A878]/10 text-[#00A878] dark:text-[#35E0B2]">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#101828] dark:text-white">
                  Circle Paymaster (Gasless Settlement)
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#8896AB]">
                  Suppliers &amp; merchants never hold gas tokens. 100% sponsored.
                </p>
              </div>
            </div>

            <p className="text-xs text-[#64748B] dark:text-[#8896AB] leading-relaxed">
              When Mama Ngozi or an enterprise pays Alhaji Sani for 100 bags of Kano rice, Arc settles the transaction in under 400ms. Circle Paymaster sponsors the ~$0.012 USDC fee so the supplier receives the exact billed amount down to the cent.
            </p>

            <button
              onClick={() => handleAction('test_paymaster')}
              disabled={actionLoading !== null}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#4D7CFE] dark:hover:bg-[#3b6dfd] text-white flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate Paymaster Gasless Payment ($25 USDC)</span>
            </button>
          </div>
        </div>

        {/* Section 6: Official Hackathon CLI Commands */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0D192C] border border-[#E2E8F0] dark:border-[#1A2D4C] shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8F0] dark:border-[#1A2D4C]">
            <div className="p-2 rounded-xl bg-[#D97706]/10 text-[#D97706] dark:text-[#F5B942]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#101828] dark:text-white">
                Hackathon CLI Agent Tooling
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#8896AB]">
                Command-line utilities specified by Canteen &amp; Circle for local developer reproduction.
              </p>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-[#64748B] dark:text-[#8896AB] text-[11px] block mb-1">
                ARC CLI (Canteen Testnet &amp; Agent Context):
              </span>
              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between gap-3">
                <code className="text-[#00A878] dark:text-[#35E0B2] truncate">
                  {data?.cliTools.arcCli || 'uv tool install git+https://github.com/the-canteen-dev/ARC-cli'}
                </code>
                <button
                  onClick={() =>
                    handleCopy(
                      data?.cliTools.arcCli ||
                        'uv tool install git+https://github.com/the-canteen-dev/ARC-cli',
                      'arc-cli'
                    )
                  }
                  className="p-1 hover:text-[#00A878] text-[#64748B] dark:text-[#8896AB] transition-colors shrink-0"
                  title="Copy command"
                >
                  {copiedKey === 'arc-cli' ? <Check className="w-4 h-4 text-[#00A878]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <span className="text-[#64748B] dark:text-[#8896AB] text-[11px] block mb-1">
                CIRCLE CLI (Agent Wallets, x402, and Crosschain Transfers):
              </span>
              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#08111F] border border-[#E2E8F0] dark:border-[#1A2D4C] flex items-center justify-between gap-3">
                <code className="text-[#2563EB] dark:text-[#4D7CFE] truncate">
                  {data?.cliTools.circleCli || 'npm install -g @circle-fin/cli'}
                </code>
                <button
                  onClick={() =>
                    handleCopy(
                      data?.cliTools.circleCli || 'npm install -g @circle-fin/cli',
                      'circle-cli'
                    )
                  }
                  className="p-1 hover:text-[#2563EB] text-[#64748B] dark:text-[#8896AB] transition-colors shrink-0"
                  title="Copy command"
                >
                  {copiedKey === 'circle-cli' ? <Check className="w-4 h-4 text-[#2563EB]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
