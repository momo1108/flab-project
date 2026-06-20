import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router';
import { useState, type PropsWithChildren } from 'react';

// TypeScript only:
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/react-query').QueryClient;
  }
}

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const [queryClient] = useState(() => {
    const qc = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5분
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    });
    window.__TANSTACK_QUERY_CLIENT__ = qc;

    return qc;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
