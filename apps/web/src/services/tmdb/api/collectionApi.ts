import { tmdbClient } from '../tmdbClient';
import type { Collection } from '@/types/tmdb';

// ===== API Functions =====

export const searchCollections = (query: string, page: number = 1): Promise<{ results: Collection[] }> => {
  return tmdbClient.request(`/search/collection?query=${encodeURIComponent(query)}&page=${page}`);
};

export const getCollectionDetail = (id: number): Promise<Collection> => {
  return tmdbClient.request<Collection>(`/collection/${id}`);
};
