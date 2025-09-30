'use client';
import { ReactNode } from 'react';
import { WagmiProvider, http, createConfig } from 'wagmi';
import { base, baseSepolia, hardhat, localhost } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { envContracts } from '../lib/contracts';

const chains = [localhost, hardhat, baseSepolia, base];

const config = getDefaultConfig({
  appName: 'ShibaToot DEX',
  projectId: 'shibatoot-demo', // for RainbowKit (public id for demo)
  chains,
  transports: {
    [localhost.id]: http('http://127.0.0.1:8545'),
    [hardhat.id]: http('http://127.0.0.1:8545'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
    [base.id]: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.base.org')
  }
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({ accentColor: '#ff5c8a' })}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
