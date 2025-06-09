import { HydrateClient, prefetch } from '@/lib/tanstack-query/server';
import { redirectToScalarForm } from './actions';
import { CreatePlanetMutationForm } from './orpc-mutation';
import { ListPlanetsQuery } from './orpc-query';
import { OrpcServerAction } from './orpc-server-action';
import { orpc } from '@/lib/tanstack-query/client';
import { Suspense } from 'react';

export default async function Home() {
  // prefetch the query
  prefetch(orpc.planet.list.infiniteOptions({
    input: (cursor) => ({ cursor, limit: 10 }),
    getNextPageParam: (lastPage) =>
      lastPage.length === 10 ?
        lastPage.at(-1)?.id :
        null,
    initialPageParam: 0
  }));
  return (
    <div>
      {/* Hydrate client component with prefetched data */}
      <HydrateClient>
        {/* Introduce a suspense boundary for loading state */}
        <Suspense fallback={<div>Loading...</div>}>
          <ListPlanetsQuery />
        </Suspense>
      </HydrateClient>
    </div>
  );
}
