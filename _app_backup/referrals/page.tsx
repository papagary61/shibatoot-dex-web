'use client';
import { useState } from 'react';
import { usePublicClient, useWalletClient, useAccount } from 'wagmi';
import { Address, keccak256, stringToBytes } from 'viem';
import { REGISTRY_ABI } from '../../lib/abi/ReferralRegistry';
import { contracts } from '../../lib/contracts';

export default function Referrals() {
  const [code, setCode] = useState('SHIBA');
  const { data: wallet } = useWalletClient();
  const client = usePublicClient();
  const { address } = useAccount();

  async function register() {
    if (!wallet) return;
    const hash = await wallet.writeContract({
      address: contracts.registry,
      abi: REGISTRY_ABI,
      functionName: 'setCode',
      args: [keccak256(stringToBytes(code))]
    });
    await client.waitForTransactionReceipt({ hash });
    alert('Code registered');
  }

  return (
    <div className="card p-6">
      <h1>Referrals</h1>
      <p className="text-sm text-neutral-400 mt-2">Register a referral code tied to your address.</p>
      <div className="mt-4 flex gap-2">
        <input className="input" value={code} onChange={e=>setCode(e.target.value)} />
        <button className="btn" onClick={register}>Register</button>
      </div>
      <p className="text-xs text-neutral-500 mt-2">Your address: {address}</p>
    </div>
  );
}
