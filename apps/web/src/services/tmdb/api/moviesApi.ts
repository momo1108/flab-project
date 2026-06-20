import { tmdbClient } from '../tmdbClient';
import type { MovieResponse, SearchResponse, SimilarMoviesResponse } from '@/types/tmdb';
import { getLocalDateString } from '@/utils/format';

// ===== API Functions =====

export const getPopularMovies = (page: number = 1): Promise<MovieResponse> => {
  return tmdbClient.request<MovieResponse>(`/movie/popular?page=${page}`);
};

export const getTrendingMovies = (timeWindow: 'day' | 'week' = 'day'): Promise<MovieResponse> => {
  return tmdbClient.request<MovieResponse>(`/trending/movie/${timeWindow}`);
};

export const discoverMovies = (params: {
  page?: number;
  with_genres?: string;
  with_keywords?: string;
  'release_date.lte'?: string;
  sort_by?: string;
}): Promise<MovieResponse> => {
  const localDateString = getLocalDateString();

  // prevent sideeffect by copying params
  const queryParamsObj = { ...params };
  // if release_date.lte is not passed, use localDateString
  if (!queryParamsObj['release_date.lte']) queryParamsObj['release_date.lte'] = localDateString;

  const queryParams = new URLSearchParams();
  Object.entries(queryParamsObj).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, String(value));
    }
  });
  return tmdbClient.request<MovieResponse>(`/discover/movie?${queryParams.toString()}`);
};

export const searchMovies = (query: string, page: number = 1): Promise<SearchResponse> => {
  return tmdbClient.request<SearchResponse>(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
};

export const getSimilarMovies = (id: number, page: number = 1): Promise<SimilarMoviesResponse> => {
  return tmdbClient.request<SimilarMoviesResponse>(`/movie/${id}/similar?page=${page}`);
};
