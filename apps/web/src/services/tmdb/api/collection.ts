import { tmdbClient } from '../tmdbClient';
import type { Collection } from '@/types/tmdb';

// ===== API Functions =====

export const searchCollections = (query: string, page: number = 1): Promise<{ results: Collection[] }> =>
  tmdbClient.request(`/search/collection?query=${encodeURIComponent(query)}&page=${page}`);

export const getCollectionDetail = (id: number): Promise<Collection> =>
  tmdbClient.request<Collection>(`/collection/${id}`);
