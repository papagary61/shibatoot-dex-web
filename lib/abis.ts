// lib/abis.ts
// Minimal ABIs used by the frontend. Keep these tiny & focused.

export const erc20Abi = [
  { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { type: "function", name: "symbol",   stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "balanceOf",stateMutability: "view", inputs: [{ name: "owner", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "allowance",stateMutability: "view", inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "approve",  stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }] },
] as const;

// We bundle just the functions we call from Factory and Pool into one ABI array.
// (It's OK to pass an ABI that contains only the specific function you call.)
export const getPoolAbi = [
  // Factory.getPool(token0, token1, poolType) -> address
  { type: "function", name: "getPool", stateMutability: "view", inputs: [
      { name: "tokenA", type: "address" },
      { name: "tokenB", type: "address" },
      { name: "poolType", type: "bytes32" }
    ], outputs: [{ type: "address" }] },

  // Pool.getReserves() -> (reserve0, reserve1)
  { type: "function", name: "getReserves", stateMutability: "view", inputs: [], outputs: [
      { name: "reserve0", type: "uint112" },
      { name: "reserve1", type: "uint112" }
    ] },
] as const;

// Router: if your contract exposes `exactInput(...)` use that; if you used a Uniswap-style
// `swapExactTokensForTokens(...)`, this entry matches the call in your current page.tsx.
// (We can switch to exactInput later if needed.)
export const routerAbi = [
  {
    type: "function",
    name: "swapExactTokensForTokens",
    stateMutability: "nonpayable",
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "amountOutMin", type: "uint256" },
      { name: "path", type: "address[]" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" }
    ],
    outputs: [{ type: "uint256[]" }],
  },

  // If your Router instead has `exactInput(tokenIn, tokenOut, amountIn, amountOutMin, to)`
  // uncomment this and update the call site:
  // {
  //   type: "function",
  //   name: "exactInput",
  //   stateMutability: "nonpayable",
  //   inputs: [
  //     { name: "tokenIn", type: "address" },
  //     { name: "tokenOut", type: "address" },
  //     { name: "amountIn", type: "uint256" },
  //     { name: "amountOutMin", type: "uint256" },
  //     { name: "to", type: "address" }
  //   ],
  //   outputs: [{ type: "uint256" }],
  // },
] as const;
