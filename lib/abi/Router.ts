export const ROUTER_ABI = [
  { "type":"function","name":"exactInput","stateMutability":"nonpayable",
    "inputs":[
      {"name":"tokenIn","type":"address"},
      {"name":"tokenOut","type":"address"},
      {"name":"amountIn","type":"uint256"},
      {"name":"amountOutMin","type":"uint256"},
      {"name":"to","type":"address"}
    ],
    "outputs":[{"type":"uint256"}]
  },
  { "type":"function","name":"quoteSingle","stateMutability":"view",
    "inputs":[
      {"name":"pool","type":"address"},
      {"name":"tokenIn","type":"address"},
      {"name":"amountIn","type":"uint256"}
    ],
    "outputs":[{"type":"uint256"}]
  }
] as const;
