// lib/pricing.ts
"use client";
import { createPublicClient, http, parseUnits, formatUnits, type Address } from "viem";
import { hardhat, baseSepolia } from "viem/chains";
import { FACTORY_ABI, POOL_ABI, ROUTER_ABI } from "./abi";
import { contracts } from "./contracts";

// pick localhost by default; adjust if you point to Base Sepolia later
const chain = hardhat;

const publicClient = createPublicClient({
  chain,
  transport: http(), // uses window.ethereum / localhost if available
});

export function toWei(amount: string, decimals: number) {
  if (!amount || isNaN(Number(amount))) return 0n;
  return parseUnits(amount, decimals);
}

export function fromWei(amount: bigint, decimals: number) {
  return formatUnits(amount, decimals);
}

export async function getPoolAddress(
  tokenA: Address,
  tokenB: Address
): Promise<Address | null> {
  try {
    const addr = await publicClient.readContract({
      address: contracts.factory,
      abi: FACTORY_ABI,
      functionName: "getPool",
      args: [tokenA, tokenB, contracts.CP],
    });
    return (addr as Address) || null;
  } catch {
    return null;
  }
}

export async function getReserves(pool: Address) {
  const [r0, r1, t0, t1] = await Promise.all([
    publicClient.readContract({ address: pool, abi: POOL_ABI, functionName: "getReserves" }) as Promise<[bigint, bigint]>,
    publicClient.readContract({ address: pool, abi: POOL_ABI, functionName: "getReserves" }) as Promise<[bigint, bigint]>, // call once; we’ll destructure
    publicClient.readContract({ address: pool, abi: POOL_ABI, functionName: "token0" }) as Promise<Address>,
    publicClient.readContract({ address: pool, abi: POOL_ABI, functionName: "token1" }) as Promise<Address>,
  ]).then(([rs, _dup, token0, token1]) => [rs[0], rs[1], token0, token1] as const);
  return { reserve0: r0, reserve1: r1, token0: t0, token1: t1 };
}

// spot price (tokenIn → tokenOut), using constant product rOut/rIn (no fee)
export function spotPriceConstantProduct(
  tokenIn: Address,
  tokenOut: Address,
  reserves: { reserve0: bigint; reserve1: bigint; token0: Address; token1: Address }
) {
  const { reserve0, reserve1, token0, token1 } = reserves;
  if (tokenIn.toLowerCase() === token0.toLowerCase() && tokenOut.toLowerCase() === token1.toLowerCase()) {
    // price = tokensOut per 1 tokenIn at current reserves
    return Number(reserve1) / Number(reserve0 || 1n);
  }
  if (tokenIn.toLowerCase() === token1.toLowerCase() && tokenOut.toLowerCase() === token0.toLowerCase()) {
    return Number(reserve0) / Number(reserve1 || 1n);
  }
  return 0;
}

// quote via router if available; fall back to constant-product math
export async function quoteExactIn(
  tokenIn: Address,
  tokenOut: Address,
  amountIn: bigint
): Promise<bigint> {
  try {
    const out = await publicClient.readContract({
      address: contracts.router,
      abi: ROUTER_ABI,
      functionName: "quoteSingle",
      args: [tokenIn, tokenOut, amountIn],
    });
    return out as bigint;
  } catch {
    const pool = await getPoolAddress(tokenIn, tokenOut);
    if (!pool) return 0n;
    const r = await getReserves(pool);
    // x*y=k constant product with 0 fee fallback
    // out = amountIn * rOut / (rIn + amountIn)
    if (tokenIn.toLowerCase() === r.token0.toLowerCase()) {
      return (amountIn * r.reserve1) / (r.reserve0 + amountIn);
    } else {
      return (amountIn * r.reserve0) / (r.reserve1 + amountIn);
    }
  }
}
