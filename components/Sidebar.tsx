import Link from 'next/link'

const link = 'block hover:bg-white/5 rounded-xl px-3 py-2 transition'

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 shrink-0 border-r border-white/10 p-4 bg-black text-white">
      <div className="text-xl font-semibold mb-4">🦴 ShibaToot</div>
      <nav className="space-y-1">
        <Link className={link} href="/">Dashboard</Link>
        <Link className={link} href="/dex">DEX</Link>
        <Link className={link} href="/pools">Pools</Link>
        <Link className={link} href="/portfolio">Portfolio</Link>
        <Link className={link} href="/referrals">Referrals</Link>
        <Link className={link} href="/settings">Settings</Link>
        <Link className={link} href="/presales">Presales</Link>
        <Link className={link} href="/admin">Admin</Link>
      </nav>
    </aside>
  )
}
