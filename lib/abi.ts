// lib/abi.ts
export const FACTORY_ABI = [
  // getPool(tokenA, tokenB, poolTypeBytes32) -> address
  { "type":"function","name":"getPool","stateMutability":"view","inputs":[
      {"name":"tokenA","type":"address"},
      {"name":"tokenB","type":"address"},
      {"name":"poolType","type":"bytes32"}
    ],
    "outputs":[{"name":"","type":"address"}]
  }
] as const;

export const POOL_ABI = [
  // getReserves() -> (uint112 reserve0, uint112 reserve1)
  { "type":"function","name":"getReserves","stateMutability":"view","inputs":[],"outputs":[
      {"name":"reserve0","type":"uint112"},
      {"name":"reserve1","type":"uint112"}
    ]
  },
  { "type":"function","name":"token0","stateMutability":"view","inputs":[],"outputs":[{"type":"address"}] },
  { "type":"function","name":"token1","stateMutability":"view","inputs":[],"outputs":[{"type":"address"}] }
] as const;

export const ROUTER_ABI = [
  // quoteSingle(tokenIn, tokenOut, amountIn) -> amountOut
  { "type":"function","name":"quoteSingle","stateMutability":"view","inputs":[
      {"name":"tokenIn","type":"address"},
      {"name":"tokenOut","type":"address"},
      {"name":"amountIn","type":"uint256"}
    ],
    "outputs":[{"type":"uint256"}]
  },
  // exactInput(tokenIn, tokenOut, amountIn, amountOutMin, to)
  { "type":"function","name":"exactInput","stateMutability":"nonpayable","inputs":[
      {"name":"tokenIn","type":"address"},
      {"name":"tokenOut","type":"address"},
      {"name":"amountIn","type":"uint256"},
      {"name":"amountOutMin","type":"uint256"},
      {"name":"to","type":"address"}
    ],
    "outputs":[]
  }
] as const;
