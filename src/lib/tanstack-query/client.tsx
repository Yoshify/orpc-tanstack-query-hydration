import { client } from '@/lib/orpc';
import { createQueryClient } from './query-client';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import { type QueryClient, QueryClientProvider, isServer } from '@tanstack/react-query';

export const orpc = createTanstackQueryUtils(client);

let clientQueryClientSingleton: QueryClient | undefined;
const getQueryClient = () => {
    if (isServer) {
        // Server: always make a new query client
        return createQueryClient();
    }

    if (!clientQueryClientSingleton) {
        // Browser: make a new query client if we don't already have one
        clientQueryClientSingleton = createQueryClient();
    }

    return clientQueryClientSingleton;
};

export const ORPCQueryProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = getQueryClient();
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};