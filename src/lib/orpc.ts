import type { router } from '@/router'
import type { RouterClient } from '@orpc/server'
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createRouterUtils } from '@orpc/tanstack-query'
import { BatchLinkPlugin } from '@orpc/client/plugins'
import { PlanetSerializer } from '@/lib/serializer'

/**
 * This is part of the Optimize SSR setup.
 *
 * @see {@link https://orpc.unnoq.com/docs/adapters/next#optimize-ssr}
 */
declare global {
  var $client: RouterClient<typeof router> | undefined
}

const link = new RPCLink({
  url: () => {
    if (typeof window === 'undefined') {
      throw new Error('Cannot create RPC link in server-side')
    }

    return `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/rpc`
  },
  customJsonSerializers: [PlanetSerializer],
  plugins: [
    new BatchLinkPlugin({
      groups: [{
        condition: () => true,
        context: {},
      }],
    }),
  ],
})

export const client: RouterClient<typeof router> = globalThis.$client ?? createORPCClient(link)

export const orpc = createRouterUtils(client)
