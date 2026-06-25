import { tmdbClient } from '../tmdbClient';
import type { TMDBConfiguration } from '@/types/tmdb';

// ===== API Functions =====

export const getConfiguration = (): Promise<TMDBConfiguration> =>
  tmdbClient.request<TMDBConfiguration>('/configuration');
