'use client';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Header() {
  return (
    <header className="border-b border-neutral-800 sticky top-0 z-20 bg-neutral-950/70 backdrop-blur">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <nav className="flex items-center gap-4 text-sm">
          <Link className="hover:underline" href="/">Swap</Link>
          <Link className="hover:underline" href="/pools">Pools</Link>
          <Link className="hover:underline" href="/portfolio">Portfolio</Link>
          <Link className="hover:underline" href="/referrals">Referrals</Link>
          <Link className="hover:underline" href="/settings">Settings</Link>
        </nav>
        <ConnectButton />
      </div>
    </header>
  );
}
