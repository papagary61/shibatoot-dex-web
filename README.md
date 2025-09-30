# ShibaToot DEX Web

A minimal, functional DEX frontend for the ShibaToot contracts. Supports:
- Connect wallet (RainbowKit)
- Swap (Router.exactInput)
- Pools: add liquidity (transfer + mint)
- Portfolio balances
- Referral code registration

## Quick Start (Localhost)

1) In your contracts repo, run a local node and deploy contracts + mocks, then note addresses:
   - **Factory**, **Router**, **ReferralRegistry**, **USDC**, **SHBT**.

2) In this web folder:

```bash
npm i
# Set env (replace with your printed addresses)
$env:NEXT_PUBLIC_FACTORY="0x..."
$env:NEXT_PUBLIC_ROUTER="0x..."
$env:NEXT_PUBLIC_REGISTRY="0x..."
$env:NEXT_PUBLIC_USDC="0x..."
$env:NEXT_PUBLIC_SHBT="0x..."
npm run dev
```

Open http://localhost:3000. In your wallet, connect to **Localhost 8545** network.

## Env variables
- NEXT_PUBLIC_FACTORY
- NEXT_PUBLIC_ROUTER
- NEXT_PUBLIC_REGISTRY
- NEXT_PUBLIC_USDC
- NEXT_PUBLIC_SHBT
- (optional) NEXT_PUBLIC_RPC_URL for Base mainnet

## Notes
- Slippage UI is informational; minOut is set to 0 in demo swap. Update before production.
- Add/Remove liquidity flow is simplified for CP pools (transfer then mint).
