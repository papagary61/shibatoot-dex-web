import factoryAbi from './Factory.json'
import routerAbi from './Router.json'
import addresses from './addresses.json'

export const ADDRS = {
  FACTORY: addresses.base.factory as `0x${string}`,
  ROUTER:  addresses.base.router  as `0x${string}`,
}

export const ABIS = {
  factory: factoryAbi as const,
  router:  routerAbi  as const,
}
