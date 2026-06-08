import { tmdbClient } from './tmdbClient';
import { queryKeys } from './queryKeys';
import { queryConfig } from './queryConfig';
import type { TMDBConfiguration } from '@/types/tmdb';

// ===== API Functions =====

export const getConfiguration = (): Promise<TMDBConfiguration> => {
  return tmdbClient.request<TMDBConfiguration>('/configuration');
};

// ===== Query Options =====

export const configurationQuery = () => ({
  queryKey: queryKeys.configuration,
  queryFn: () => getConfiguration(),
  ...queryConfig.configuration,
});
