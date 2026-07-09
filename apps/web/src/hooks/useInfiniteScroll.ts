import {
  useSuspenseInfiniteQuery,
  type UseSuspenseInfiniteQueryOptions,
  type InfiniteData,
} from '@tanstack/react-query';
import { startTransition, useDeferredValue, useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  rootMargin?: string;
  threshold?: number;
}

export const useInfiniteScroll = <
  TQueryFnData,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[],
  TPageParam = unknown,
>(
  query: UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>,
  options: UseInfiniteScrollOptions = {},
): {
  data: InfiniteData<TData>;
  deferredData: InfiniteData<TData>;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
} => {
  const { rootMargin = '0px', threshold = 0.1 } = options;

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >(query);
  const deferredData = useDeferredValue(data);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          startTransition(() => {
            fetchNextPage();
          });
        }
      },
      { threshold, rootMargin },
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage, rootMargin, threshold]);

  return {
    data: data as InfiniteData<TData>,
    deferredData: deferredData as InfiniteData<TData>,
    loadMoreRef,
    hasNextPage,
    isFetchingNextPage,
  };
};
