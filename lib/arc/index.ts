/**
 * Arc Financial Settlement Layer
 * High-speed, deterministic settlement network for autonomous financial operators.
 */

export interface ArcNetworkConfig {
  chainId: number;
  name: string;
  currency: string;
  blockExplorerUrl: string;
  rpcUrl: string;
  isTestnet: boolean;
}

export const ARC_CONFIG: ArcNetworkConfig = {
  chainId: 84532,
  name: 'Arc Settlement Layer (USDC)',
  currency: 'USDC',
  blockExplorerUrl: 'https://explorer.arc.network/tx',
  rpcUrl: 'https://rpc.arc.network',
  isTestnet: true,
};

export function formatArcAddress(address: string): string {
  if (!address || address.length < 10) return address || '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

export function formatArcTxHash(hash: string): string {
  if (!hash || hash.length < 14) return hash || '';
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
}

export function getArcExplorerUrl(hash: string): string {
  return `${ARC_CONFIG.blockExplorerUrl}/${hash}`;
}
