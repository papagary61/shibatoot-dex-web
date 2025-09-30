// pages/_app.tsx
import type { AppProps } from 'next/app'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import '../styles/globals.css'
import { wagmiConfig } from '../lib/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider theme={darkTheme()}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}
