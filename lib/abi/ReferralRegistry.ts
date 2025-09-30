export const REGISTRY_ABI = [
  { "type":"function","name":"setCode","stateMutability":"nonpayable","inputs":[{"type":"bytes32"}],"outputs":[]},
  { "type":"function","name":"setReferrerFor","stateMutability":"nonpayable","inputs":[{"type":"address"},{"type":"bytes32"}],"outputs":[]},
  { "type":"function","name":"referrerOf","stateMutability":"view","inputs":[{"type":"address"}],"outputs":[{"type":"address"}]},
  { "type":"function","name":"ownerOfCode","stateMutability":"view","inputs":[{"type":"bytes32"}],"outputs":[{"type":"address"}]}
] as const;
