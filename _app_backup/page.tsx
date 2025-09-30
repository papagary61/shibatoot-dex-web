"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import SlippageSelector from "@/components/SlippageSelector";
import { contracts } from "@/lib/contracts";
import { erc20Abi, getPoolAbi, routerAbi } from "@/lib/abis";

import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  parseUnits,
  formatUnits,
  type Address,
} from "viem";
import { hardhat } from "viem/chains";

// ---------- helpers ----------
type Sym = "USDC" | "SHBT";

const DECIMALS: Record<Sym, number> = {
  USDC: 6,
  SHBT: 18,
};

const ADDR: Record<Sym, Address> = {
  USDC: contracts.tokens.USDC,
  SHBT: contracts.tokens.SHBT,
};

function getClients() {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error("No wallet found. Open your wallet or install one.");
  }

  // Use the injected wallet provider for BOTH write & read.
  // This avoids browser → http(127.0.0.1:8545) CORS issues.
  const transport = custom((window as any).ethereum);

  const walletClient = createWalletClient({
    chain: hardhat,
    transport,
  });

  const publicClient = createPublicClient({
    chain: hardhat,
    transport, // <-- CHANGED from http() to custom(window.ethereum)
  });

  return { walletClient, publicClient };
}


// x*y=k constant product quote with 0.3% fee (adjust if your pool uses different fee)
function quoteConstantProduct(
  amountIn: bigint,
  reserveIn: bigint,
  reserveOut: bigint,
  feeBps = 30 // 0.30%
) {
  if (amountIn <= 0n || reserveIn <= 0n || reserveOut <= 0n) return 0n;
  const amountInWithFee = amountIn * BigInt(10_000 - feeBps) / 10_000n;
  return (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee);
}

// ---------- page ----------
export default function SwapPage() {
  const { address } = useAccount();

  // form
  const [tokenIn, setTokenIn] = useState<Sym>("USDC");
  const [tokenOut, setTokenOut] = useState<Sym>("SHBT");
  const [amountIn, setAmountIn] = useState<string>("100");
  const [slippage, setSlippage] = useState<number>(0.5);

  // chain data
  const [pool, setPool] = useState<Address | null>(null);
  const [res0, setRes0] = useState<bigint>(0n);
  const [res1, setRes1] = useState<bigint>(0n);

  // ui
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  // min received (with slippage) based on live quote
  const decIn = DECIMALS[tokenIn];
  const decOut = DECIMALS[tokenOut];

  const amountInWei = useMemo(() => {
    try {
      return parseUnits(amountIn || "0", decIn);
    } catch {
      return 0n;
    }
  }, [amountIn, decIn]);

  const { reserveIn, reserveOut } = useMemo(() => {
    // order reserves the same way as tokenIn/tokenOut
    if (!pool) return { reserveIn: 0n, reserveOut: 0n };
    // Our Factory stores USDC as token0 in pool deploy script — but to be safe we’ll
    // just map by address order used in getPool (tokenA, tokenB).
    // Here, we’ll assume tokenA=USDC, tokenB=SHBT like your setup.
    const tIn = ADDR[tokenIn];
    const tOut = ADDR[tokenOut];

    // If your pool always stores token0 < token1 by address, we need to map res0/res1:
    const USDCis0 = ADDR.USDC.toLowerCase() < ADDR.SHBT.toLowerCase();
    const R0 = res0;
    const R1 = res1;

    const map = (tin: Address, tout: Address) => {
      const token0 = USDCis0 ? ADDR.USDC : ADDR.SHBT;
      const token1 = USDCis0 ? ADDR.SHBT : ADDR.USDC;
      const r0 = (tin === token0) ? R0 : R1;
      const r1 = (tout === token1) ? (USDCis0 ? R1 : R0) : (USDCis0 ? R0 : R1);
      return { reserveIn: r0, reserveOut: r1 };
    };

    return map(tIn, tOut);
  }, [pool, res0, res1, tokenIn, tokenOut]);

  const quoteOut = useMemo(() => {
    return quoteConstantProduct(amountInWei, reserveIn, reserveOut);
  }, [amountInWei, reserveIn, reserveOut]);

  const minOut = useMemo(() => {
    const bps = Math.round(slippage * 100); // 0.5% -> 50
    return quoteOut * BigInt(10_000 - bps) / 10_000n;
  }, [quoteOut, slippage]);

  const outReadable = formatUnits(quoteOut, decOut);
  const minReadable = formatUnits(minOut, decOut);

  // flip
  function flip() {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
  }

  // Load pool address + reserves (and refresh every 10s)
  useEffect(() => {
    let stop = false;

    async function load() {
      try {
        const { publicClient } = getClients();

        // 1) get pool from factory (IMPORTANT: include pool type contracts.CP)
        const p = (await publicClient.readContract({
          address: contracts.factory,
          abi: getPoolAbi,
          functionName: "getPool",
          args: [ADDR.USDC, ADDR.SHBT, contracts.CP],
        })) as Address;

        if (stop) return;
        setPool(p);

        if (p === "0x0000000000000000000000000000000000000000") {
          setRes0(0n);
          setRes1(0n);
          return;
        }

        // 2) reserves from pool (same ABI has getReserves fragment)
        const [r0, r1] = (await publicClient.readContract({
          address: p,
          abi: getPoolAbi,
          functionName: "getReserves",
          args: [],
        })) as readonly [bigint, bigint];

        if (stop) return;
        setRes0(r0);
        setRes1(r1);
      } catch (e) {
        console.error("load reserves error:", e);
        if (!stop) {
          setPool(null);
          setRes0(0n);
          setRes1(0n);
        }
      }
    }

    load();
    const id = setInterval(load, 10_000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, [tokenIn, tokenOut]); // refresh if user flips tokens

  const canSwap =
    !!address &&
    amountInWei > 0n &&
    quoteOut > 0n &&
    ADDR[tokenIn] !== ADDR[tokenOut] &&
    pool &&
    pool !== "0x0000000000000000000000000000000000000000";

  // --------- SWAP (approve -> swapExactTokensForTokens) ----------
  async function handleSwap() {
    try {
      if (!canSwap) return;
      setLoading(true);
      setTxHash(null);

      const { walletClient, publicClient } = getClients();
      const [account] = await walletClient.getAddresses();

      const tokenInAddr = ADDR[tokenIn];
      const routerAddr = contracts.router as Address;

      // 1) Check allowance and approve if needed
      const allowance = (await publicClient.readContract({
        address: tokenInAddr,
        abi: erc20Abi,
        functionName: "allowance",
        args: [account, routerAddr],
      })) as bigint;

      if (allowance < amountInWei) {
        const txApprove = await walletClient.writeContract({
          account,
          address: tokenInAddr,
          abi: erc20Abi,
          functionName: "approve",
          args: [routerAddr, amountInWei],
        });
        await publicClient.waitForTransactionReceipt({ hash: txApprove });
        console.log("Approved:", txApprove);
      }

      // 2) Swap
      const path = [ADDR[tokenIn], ADDR[tokenOut]] as Address[];
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 5); // 5 min

      const txSwap = await walletClient.writeContract({
        account,
        address: routerAddr,
        abi: routerAbi,
        functionName: "swapExactTokensForTokens",
        args: [amountInWei, minOut, path, account, deadline],
      });

      await publicClient.waitForTransactionReceipt({ hash: txSwap });
      setTxHash(txSwap);
      alert(`Swap sent!\nTx: ${txSwap}`);
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex justify-center mt-10">
      <div className="bg-gray-900 text-white p-6 rounded-2xl w-[480px] shadow-lg space-y-6">
        <h2 className="text-xl font-bold">Swap</h2>

        {/* From */}
        <div className="space-y-2">
          <label className="block text-sm text-gray-300">From</label>
          <div className="flex gap-2">
            <select
              value={tokenIn}
              onChange={(e) => setTokenIn(e.target.value as Sym)}
              className="min-w-[110px] px-3 py-2 rounded bg-gray-800 border border-gray-700"
            >
              <option value="USDC">USDC</option>
              <option value="SHBT">SHBT</option>
            </select>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.0"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              className="flex-1 px-3 py-2 rounded bg-gray-800 border border-gray-700"
            />
          </div>
        </div>

        {/* Flip */}
        <div className="flex justify-center">
          <button
            onClick={flip}
            className="text-xs px-2 py-1 rounded-md border border-gray-700 hover:bg-gray-800"
            title="Switch tokens"
          >
            ⇅ Switch
          </button>
        </div>

        {/* To (estimated) */}
        <div className="space-y-2">
          <label className="block text-sm text-gray-300">To (estimated)</label>
          <div className="flex gap-2 items-center">
            <select
              value={tokenOut}
              onChange={(e) => setTokenOut(e.target.value as Sym)}
              className="min-w-[110px] px-3 py-2 rounded bg-gray-800 border border-gray-700"
            >
              <option value="USDC">USDC</option>
              <option value="SHBT">SHBT</option>
            </select>
            <div className="flex-1 px-3 py-2 rounded bg-gray-800 border border-gray-700 text-right">
              {outReadable}
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Min received (slippage {slippage}%):{" "}
            <span className="text-pink-400">
              {minReadable} {tokenOut}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            Pool: {pool ?? "—"} | Reserves: {formatUnits(res0, DECIMALS.USDC)} USDC /{" "}
            {formatUnits(res1, DECIMALS.SHBT)} SHBT
          </div>
        </div>

        {/* Slippage */}
        <SlippageSelector value={slippage} onChange={setSlippage} highWarnPct={3} />

        {/* Swap */}
        <button
          onClick={handleSwap}
          disabled={!canSwap || loading}
          className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 p-3 rounded-xl font-bold"
        >
          {loading ? "Swapping..." : "Swap"}
        </button>

        {/* Tx */}
        {txHash && (
          <div className="text-xs text-emerald-400 break-words">
            Sent: {txHash}
          </div>
        )}
        {!address && (
          <div className="text-xs text-amber-400">
            Connect your wallet (Localhost 8545) to execute swaps.
          </div>
        )}
      </div>
    </main>
  );
}
