'use client';
import { useEffect, useState } from 'react';
import { Address, erc20Abi, formatUnits } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';
import { contracts } from '../../lib/contracts';

export default function Portfolio() {
  const { address } = useAccount();
  const client = usePublicClient();
  const [usdc, setUsdc] = useState('0');
  const [shbt, setShbt] = useState('0');

  useEffect(()=>{
    (async () => {
      if (!address) return;
      const bu = await client.readContract({ address: contracts.tokens.USDC, abi: erc20Abi, functionName: 'balanceOf', args: [address as Address] }) as bigint;
      const bs = await client.readContract({ address: contracts.tokens.SHBT, abi: erc20Abi, functionName: 'balanceOf', args: [address as Address] }) as bigint;
      setUsdc(formatUnits(bu,6)); setShbt(formatUnits(bs,18));
    })();
  }, [address, client]);

  return (
    <div className="card p-6">
      <h1>Portfolio</h1>
      <ul className="mt-4 space-y-2">
        <li>USDC: {usdc}</li>
        <li>SHBT: {shbt}</li>
      </ul>
    </div>
  );
}
