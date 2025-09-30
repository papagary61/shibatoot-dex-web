'use client';
import { Address } from 'viem';
import { contracts } from '../lib/contracts';

const TOKENS: { addr: Address, symbol: string }[] = [
  { addr: contracts.tokens.USDC, symbol: 'USDC' },
  { addr: contracts.tokens.SHBT, symbol: 'SHBT' },
];

export function TokenSelector({ value, onChange }: { value: Address, onChange: (a:Address)=>void }) {
  return (
    <select className="input" value={value} onChange={(e)=>onChange(e.target.value as Address)}>
      {TOKENS.map(t => <option key={t.symbol} value={t.addr}>{t.symbol}</option>)}
    </select>
  );
}
