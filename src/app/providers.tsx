'use client';

import { orpc } from '@/lib/orpc';
import { ORPCQueryProvider } from '@/lib/tanstack-query/client';
import { Planet } from '@/schemas/planet-class';
import { StandardRPCJsonSerializer } from '@orpc/client/standard';
import {
  defaultShouldDehydrateQuery,
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
  return (
    <ORPCQueryProvider>
      {props.children}
    </ORPCQueryProvider>
  );
}
