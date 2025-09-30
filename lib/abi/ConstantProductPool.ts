export const POOL_ABI = [
  { "type":"function","name":"token0","stateMutability":"view","inputs":[],"outputs":[{"type":"address"}]},
  { "type":"function","name":"token1","stateMutability":"view","inputs":[],"outputs":[{"type":"address"}]},
  { "type":"function","name":"getReserves","stateMutability":"view","inputs":[],"outputs":[{"type":"uint112"},{"type":"uint112"},{"type":"uint32"}]},
  { "type":"function","name":"mint","stateMutability":"nonpayable","inputs":[{"type":"address"}],"outputs":[{"type":"uint256"}]},
  { "type":"function","name":"burn","stateMutability":"nonpayable","inputs":[{"type":"address"}],"outputs":[{"type":"uint256"},{"type":"uint256"}]},
  { "type":"function","name":"swap","stateMutability":"nonpayable","inputs":[{"type":"uint256"},{"type":"uint256"},{"type":"address"},{"type":"bytes"}],"outputs":[]}
] as const;
