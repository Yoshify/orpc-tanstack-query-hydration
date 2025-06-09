'use client';

import { orpc } from '@/lib/orpc';
import { Planet } from '@/schemas/planet-class';
import { StandardRPCJsonSerializer } from '@orpc/client/standard';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useState } from 'react';

const serializer = new StandardRPCJsonSerializer({
  customJsonSerializers: [
    {
      type: 21,
      condition: (data) => data instanceof Planet,
      serialize: (data) => ({ id: data.id, name: data.name }),
      deserialize: (data) => new Planet(data.id, data.name),
    },
  ],
});

export function Providers(props: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          dehydrate: {
            serializeData: (data) => {
              console.log('serializeData', data);
              const [json, meta] = serializer.serialize(data);
              return { json, meta };
            },
          },
          hydrate: {
            deserializeData: (data) => {
              console.log('deserializeData', data);
              return serializer.deserialize(data.json, data.meta);
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {props.children}
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
