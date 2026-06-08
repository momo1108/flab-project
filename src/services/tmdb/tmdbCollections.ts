import { tmdbClient } from './tmdbClient';
import { queryConfig } from './queryConfig';
import type { Collection } from '@/types/tmdb';
import { collectionDetailQueryKey } from './queryKeys/collectionQueryKeys';

// ===== API Functions =====

export const searchCollections = (query: string, page: number = 1): Promise<{ results: Collection[] }> => {
  return tmdbClient.request(`/search/collection?query=${encodeURIComponent(query)}&page=${page}`);
};

export const getCollectionDetail = (id: number): Promise<Collection> => {
  return tmdbClient.request<Collection>(`/collection/${id}`);
};

// ===== Query Options =====

export const collectionDetailQuery = (id: number) => ({
  queryKey: collectionDetailQueryKey(id),
  queryFn: () => getCollectionDetail(id),
  ...queryConfig.movies,
  enabled: !!id,
});
