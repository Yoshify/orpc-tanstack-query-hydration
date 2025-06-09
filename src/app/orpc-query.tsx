'use client';

import { orpc } from '@/lib/tanstack-query/client';
import { Planet } from '@/schemas/planet-class';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

export function ListPlanetsQuery() {
  const { data, refetch, fetchNextPage, hasNextPage, status } =
    useSuspenseInfiniteQuery(
      orpc.planet.list.infiniteOptions({
        input: (cursor) => ({ cursor, limit: 10 }),
        getNextPageParam: (lastPage) =>
          lastPage.length === 10 ? lastPage.at(-1)?.id : null,
        initialPageParam: 0,
        refetchOnMount: false,
      })
    );

  if (status === 'error') {
    return <p>Something went wrong.</p>;
  }

  console.log(
    data.pages[0]?.every((planet) => planet instanceof Planet) ? '✅' : '❌'
  );

  return (
    <div>
      <h2>oRPC and Tanstack Query | List Planets example</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {data.pages.flatMap((page, i) =>
            page.map((planet) => (
              <tr key={`${planet.id}-${i}`}>
                <td>{planet.id}</td>
                <td>{planet.name}</td>
              </tr>
            ))
          )}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan={4}>
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage}
              >
                Load more
              </button>

              <button type="button" onClick={() => refetch()}>
                Refresh
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
