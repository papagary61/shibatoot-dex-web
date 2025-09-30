import Sidebar from '../components/Sidebar'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'
import { readContract } from 'wagmi/actions'
import { wagmiConfig } from '../lib/wagmi'
import { ABRS, ABIS } from '../lib/contracts' // <-- make sure path matches (ADDRS, ABIS)

export default function Dex() {
  const [pairsLen, setPairsLen] = useState<string>('…')

  useEffect(() => {
    (async () => {
      try {
        // Standard UniswapV2Factory call (adjust if your factory differs)
        const result = await readContract(wagmiConfig, {
          address: ADDRS.FACTORY,
          abi: ABIS.factory,
          functionName: 'allPairsLength',   // or a function your factory definitely has
          args: [],
        })
        setPairsLen(String(result))
      } catch (e) {
        setPairsLen('error')
        console.error(e)
      }
    })()
  }, [])

  return (
    <div className="min-h-screen flex bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">DEX</h1>
          <ConnectButton />
        </div>

        <div className="rounded-2xl border border-white/10 p-4 space-y-2">
          <div className="opacity-80">Factory address: <span className="font-mono">{ADDRS.FACTORY}</span></div>
          <div className="opacity-80">All pairs length: <span className="font-mono">{pairsLen}</span></div>
        </div>
      </main>
    </div>
  )
}
