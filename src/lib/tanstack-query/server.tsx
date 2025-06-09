import { createQueryClient } from './query-client';
import type { OperationKey, OperationType, ProcedureUtils } from '@orpc/tanstack-query';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { cache } from 'react';

// !IMPORTANT
// Using `cache` here means we create a stable getter
// that shares the same instance of a query client
// during the same request.
export const getQueryClient = cache(createQueryClient);

// This helper function is used to hydrate suspenseful children
// with prefetched data.
export function HydrateClient(props: { children: React.ReactNode }) {
    const queryClient = getQueryClient();
    return <HydrationBoundary state={dehydrate(queryClient)}>{props.children}</HydrationBoundary>;
}


// Helper function for easily prefetching queries in a server component.
type OrpcQueryOptions = ReturnType<ProcedureUtils<any, any, any, any>['queryOptions']>;
type OrpcInfiniteOptions = ReturnType<ProcedureUtils<any, any, any, any>['infiniteOptions']>;
export function prefetch<T extends OrpcQueryOptions | OrpcInfiniteOptions>(queryOptions: T) {
    const queryClient = getQueryClient();
    if ((queryOptions.queryKey as OperationKey<OperationType, any>)[1]?.type === 'infinite') {
        void queryClient.prefetchInfiniteQuery(queryOptions as any);
    } else {
        void queryClient.prefetchQuery(queryOptions);
    }
}
