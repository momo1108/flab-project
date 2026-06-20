import { tmdbClient } from '../tmdbClient';
import type { TMDBConfiguration } from '@/types/tmdb';

// ===== API Functions =====

export const getConfiguration = (): Promise<TMDBConfiguration> => {
  return tmdbClient.request<TMDBConfiguration>('/configuration');
};
