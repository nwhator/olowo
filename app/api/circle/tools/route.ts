import { NextResponse } from 'next/server';
import { circleClient } from '@/lib/circle';
import { ARC_CONFIG } from '@/lib/arc';

export async function GET() {
  try {
    const wallets = circleClient.getWallets();
    const gateway = circleClient.getGatewayBalance();
    const usyc = circleClient.getUsycYieldMetrics();

    return NextResponse.json({
      success: true,
      network: {
        ...ARC_CONFIG,
        latencyMs: 380,
        consensusStatus: 'FINALIZED',
        gasToken: 'USDC',
        averageGasUsdc: 0.012,
        rpcEndpoint: 'https://tameion.thecanteenapp.com/',
        testnetFaucet: 'https://testmint.myproceeds.xyz/',
      },
      wallets,
      gateway,
      usyc,
      cliTools: {
        arcCli: 'uv tool install git+https://github.com/the-canteen-dev/ARC-cli',
        circleCli: 'npm install -g @circle-fin/cli',
      },
    });
  } catch (error) {
    console.error('Error fetching Circle tools data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch infrastructure state' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, amount } = body;

    if (action === 'claim_testnet_usdc') {
      const result = circleClient.claimTestnetUsdc(amount || 500);
      return NextResponse.json({
        message: `Claimed $${amount || 500} testnet USDC from Canteen / TestMint faucet`,
        ...result,
      });
    }

    if (action === 'sweep_to_usyc') {
      const ok = circleClient.sweepToUsyc(amount || 500);
      if (!ok) {
        return NextResponse.json(
          { success: false, error: 'Insufficient operating balance to sweep' },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        message: `Successfully allocated $${amount || 500} USDC into USYC yielding 5.15% APY`,
        usyc: circleClient.getUsycYieldMetrics(),
      });
    }

    if (action === 'redeem_from_usyc') {
      const ok = circleClient.redeemFromUsyc(amount || 500);
      if (!ok) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Cannot redeem below the $5,000 untouchable shop rent reserve floor. Mandate protected!',
          },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        message: `Redeemed $${amount || 500} USDC from USYC back into operating treasury`,
        usyc: circleClient.getUsycYieldMetrics(),
      });
    }

    if (action === 'test_paymaster') {
      const payout = await circleClient.executeUsdcPayout({
        walletId: circleClient.getTreasuryWalletId(),
        destinationAddress: '0x35E0B2026F9b9e6912384aBcD891234a91238912',
        amount: 25,
        currency: 'USDC',
        idempotencyKey: `test_pm_${Date.now()}`,
        memo: 'Paymaster Gasless Verification Test',
      });
      return NextResponse.json({
        success: true,
        message: 'Paymaster gasless settlement confirmed on Arc (<500ms)',
        payout,
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Error handling tools action:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process infrastructure action' },
      { status: 500 }
    );
  }
}
