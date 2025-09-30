'use client';
import { useState } from 'react';
import { useChains } from 'wagmi';
import { contracts } from '../../lib/contracts';

export default function Settings() {
  const chains = useChains();
  return (
    <div className="card p-6">
      <h1>Settings</h1>
      <p className="text-sm text-neutral-400 mt-2">Contract addresses are loaded from environment variables at build time.</p>
      <ul className="mt-4 text-sm space-y-1">
        <li>Factory: <code>{contracts.factory}</code></li>
        <li>Router: <code>{contracts.router}</code></li>
        <li>Registry: <code>{contracts.registry}</code></li>
        <li>USDC: <code>{contracts.tokens.USDC}</code></li>
        <li>SHBT: <code>{contracts.tokens.SHBT}</code></li>
      </ul>
    </div>
  );
}
