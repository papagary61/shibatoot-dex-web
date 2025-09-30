import Sidebar from '../components/Sidebar'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Home() {
  return (
    <div className="min-h-screen flex bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">ShibaToot DEX — Dashboard</h1>
          <ConnectButton />
        </div>
        <p className="mt-4 opacity-80">If you can see this, structure is good. Next we wire data.</p>
      </main>
    </div>
  )
}
