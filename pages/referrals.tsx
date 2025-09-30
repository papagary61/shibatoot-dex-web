import Sidebar from '../components/Sidebar'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Referrals() {
  return (
    <div className="min-h-screen flex bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Referrals</h1>
          <ConnectButton />
        </div>
        <p className="opacity-80">Your referral link, stats, and payouts.</p>
      </main>
    </div>
  )
}
