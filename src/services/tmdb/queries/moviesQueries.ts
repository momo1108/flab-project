import type { Movie, MovieResponse } from '@/types/tmdb';
import { queryConfig } from '../queryConfig';
import {
  discoverMoviesQueryKey,
  moviesByGenreQueryKey,
  popularMoviesQueryKey,
  searchMoviesQueryKey,
  similarMoviesQueryKey,
  trendingMoviesQueryKey,
} from '../queryKeys/movieQueryKeys';
import { discoverMovies, getPopularMovies, getSimilarMovies, getTrendingMovies, searchMovies } from '../api/moviesApi';
import { createResultsLimitSelect } from './queryHelper';

// ===== Query Options =====

export const popularMoviesQuery = (page: number = 1, limit?: number | undefined) => ({
  queryKey: popularMoviesQueryKey(page),
  queryFn: () => getPopularMovies(page),
  select: createResultsLimitSelect<Movie, MovieResponse>(limit),
  ...queryConfig.movies,
});

export const trendingMoviesQuery = (timeWindow: 'day' | 'week' = 'day', limit?: number | undefined) => ({
  queryKey: trendingMoviesQueryKey(timeWindow),
  queryFn: () => getTrendingMovies(timeWindow),
  select: createResultsLimitSelect<Movie, MovieResponse>(limit),
  ...queryConfig.movies,
});

export const discoverMoviesQuery = (params: Record<string, string | number>) => ({
  queryKey: discoverMoviesQueryKey(params),
  queryFn: () => discoverMovies(params),
  ...queryConfig.movies,
});

export const moviesByGenreQuery = (genreId: number, page: number = 1, limit?: number | undefined) => ({
  queryKey: moviesByGenreQueryKey(genreId, page),
  queryFn: () =>
    discoverMovies({
      with_genres: String(genreId),
      sort_by: 'popularity.desc',
      page,
    }),
  select: createResultsLimitSelect<Movie, MovieResponse>(limit),
  ...queryConfig.movies,
  enabled: !!genreId,
});

export const moviesByGenresQuery = (genreIds: number[], page: number = 1, limit?: number | undefined) => {
  return genreIds.map((genreId) => ({
    queryKey: moviesByGenreQueryKey(genreId, page),
    queryFn: () =>
      discoverMovies({
        with_genres: String(genreId),
        sort_by: 'primary_release_date.desc',
        page,
      }),
    select: createResultsLimitSelect<Movie, MovieResponse>(limit),
    ...queryConfig.movies,
    enabled: !!genreId,
  }));
};

export const searchMoviesQuery = (query: string) => ({
  queryKey: searchMoviesQueryKey(query),
  queryFn: ({ pageParam = 1 }: { pageParam?: number }) => searchMovies(query, pageParam),
  initialPageParam: 1,
  getNextPageParam: (lastPage: MovieResponse) => {
    if (lastPage.page >= lastPage.total_pages) return undefined;
    return lastPage.page + 1;
  },
  ...queryConfig.search,
  enabled: query.length > 0,
});

export const similarMoviesQuery = (
  id: number,
  page: number = 1,
  enabled: boolean = true,
  limit?: number | undefined,
) => ({
  queryKey: similarMoviesQueryKey(id, page),
  queryFn: () => getSimilarMovies(id, page),
  select: createResultsLimitSelect<Movie, MovieResponse>(limit),
  ...queryConfig.movies,
  enabled: enabled && !!id,
});
