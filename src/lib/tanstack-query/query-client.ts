import { deserialize, serialize } from '@/lib/serializer';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from '@tanstack/react-query';

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // We want some stale time > 0 during SSR to prevent immediate refetching on the client
        staleTime: 60 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
        shouldRedactErrors: (error) => {
          return false;
        },
        serializeData: (data) => {
          return serialize(data);
        },
      },
      hydrate: {
        deserializeData: (data) => {
          return deserialize(data);
        },
      }
    },
  });