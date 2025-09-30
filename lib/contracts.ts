// lib/contracts.ts
import factoryAbi from '../src/abi/Factory.json'
import routerAbi from '../src/abi/Router.json'
import addrs from '../src/addresses/base.json'

export const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS ?? addrs.factory
export const ROUTER_ADDRESS  = process.env.NEXT_PUBLIC_ROUTER_ADDRESS  ?? addrs.router

export const ABIS = { factory: factoryAbi, router: routerAbi }
