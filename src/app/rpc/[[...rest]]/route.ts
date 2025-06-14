import { router } from '@/router'
import { onError } from '@orpc/server'
import { BatchHandlerPlugin } from '@orpc/server/plugins'
import { RPCHandler } from '@orpc/server/fetch'
import '../../../polyfill'
import { PlanetSerializer } from '@/lib/serializer'

const rpcHandler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error)
    }),
  ],
  customJsonSerializers: [PlanetSerializer],
  plugins: [
    new BatchHandlerPlugin(),
  ],
})

async function handleRequest(request: Request) {
  const { response } = await rpcHandler.handle(request, {
    prefix: '/rpc',
    context: {},
  })

  return response ?? new Response('Not found', { status: 404 })
}

export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
