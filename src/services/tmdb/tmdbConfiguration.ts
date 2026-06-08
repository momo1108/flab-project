import { tmdbClient } from './tmdbClient';
import { queryConfig } from './queryConfig';
import type { TMDBConfiguration } from '@/types/tmdb';
import { configurationQueryKey } from './queryKeys/configurationQueryKeys';

// ===== API Functions =====

export const getConfiguration = (): Promise<TMDBConfiguration> => {
  return tmdbClient.request<TMDBConfiguration>('/configuration');
};

// ===== Query Options =====

export const configurationQuery = () => ({
  queryKey: configurationQueryKey,
  queryFn: () => getConfiguration(),
  ...queryConfig.configuration,
});
