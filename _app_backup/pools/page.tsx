'use client';
import { useEffect, useState } from 'react';
import { Address, erc20Abi, formatUnits, parseUnits } from 'viem';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { contracts } from '../../lib/contracts';
import { POOL_ABI } from '../../lib/abi/ConstantProductPool';

export default function PoolsPage() {
  const client = usePublicClient();
  const { data: wallet } = useWalletClient();
  const { address } = useAccount();
  const [pool, setPool] = useState<Address>('0x0000000000000000000000000000000000000000');
  const [amt0, setAmt0] = useState('1000');
  const [amt1, setAmt1] = useState('1000');
  const t0 = contracts.tokens.USDC;
  const t1 = contracts.tokens.SHBT;

  useEffect(()=>{
    (async () => {
      const poolAddr = await client.readContract({
        address: contracts.factory,
        abi: [{
          type:"function", name:"getPool", stateMutability:"view",
          inputs:[{name:"tokenA",type:"address"},{name:"tokenB",type:"address"},{name:"poolType",type:"bytes32"}],
          outputs:[{type:"address"}]
        }],
        functionName: 'getPool',
        args: [t0, t1, contracts.CP]
      }) as Address;
      setPool(poolAddr);
    })();
  }, [client]);

  async function addLiq() {
    if (!wallet || pool === '0x0000000000000000000000000000000000000000') return;
    try {
      const a0 = parseUnits(amt0, 6);
      const a1 = parseUnits(amt1, 18);
      for (const [token, amt] of [[t0, a0],[t1,a1]] as [Address,bigint][]) {
        const allowance = await client.readContract({ address: token, abi: erc20Abi, functionName: 'allowance', args: [address as Address, pool] }) as bigint;
        if (allowance < amt) {
          const hash = await wallet.writeContract({ address: token, abi: erc20Abi, functionName: 'approve', args: [pool, amt] });
          await client.waitForTransactionReceipt({ hash });
        }
        const hash2 = await wallet.writeContract({ address: token, abi: erc20Abi, functionName: 'transfer', args: [pool, amt] });
        await client.waitForTransactionReceipt({ hash: hash2 });
      }
      const hash3 = await wallet.writeContract({ address: pool, abi: POOL_ABI, functionName: 'mint', args: [address as Address] });
      await client.waitForTransactionReceipt({ hash: hash3 });
      alert('Liquidity added');
    } catch(e:any) {
      alert(e?.shortMessage || e?.message || 'Add liquidity failed');
    }
  }

  return (
    <div className="card p-6">
      <h1>Pools</h1>
      <p className="text-sm text-neutral-400 mt-2">Provide liquidity by sending tokens to the pool then calling <code>mint</code>.</p>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div>
          <label>USDC amount</label>
          <input className="input mt-2" value={amt0} onChange={e=>setAmt0(e.target.value)} />
        </div>
        <div>
          <label>SHBT amount</label>
          <input className="input mt-2" value={amt1} onChange={e=>setAmt1(e.target.value)} />
        </div>
      </div>
      <button className="btn mt-4" onClick={addLiq} disabled={pool=='0x0000000000000000000000000000000000000000'}>Add Liquidity</button>
      <div className="mt-4 text-sm text-neutral-400">Pool: <code className="text-neutral-300">{pool}</code></div>
    </div>
  );
}
