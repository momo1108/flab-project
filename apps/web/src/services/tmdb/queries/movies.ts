import type { Movie, MovieResponse } from '@/types/tmdb';
import { queryConfig } from '../queryConfig';
import { moviesKeys } from '../queryKeys/movies';
import { discoverMovies, getPopularMovies, getSimilarMovies, getTrendingMovies, searchMovies } from '../api/movies';
import { createResultsLimitSelect } from './queryHelper';

// ===== Query Options =====

export const popularMoviesQuery = (page: number = 1, limit?: number | undefined) => ({
  queryKey: moviesKeys.popularList(page),
  queryFn: () => getPopularMovies(page),
  select: createResultsLimitSelect<Movie, MovieResponse>(limit),
  ...queryConfig.movies,
});

export const trendingMoviesQuery = (timeWindow: 'day' | 'week' = 'day', limit?: number | undefined) => ({
  queryKey: moviesKeys.trendingList(timeWindow),
  queryFn: () => getTrendingMovies(timeWindow),
  select: createResultsLimitSelect<Movie, MovieResponse>(limit),
  ...queryConfig.movies,
});

export const discoverMoviesQuery = (params: Record<string, string | number>) => ({
  queryKey: moviesKeys.discoveredList(params),
  queryFn: () => discoverMovies(params),
  ...queryConfig.movies,
});

export const moviesByGenreQuery = (genreId: number, page: number = 1, limit?: number | undefined) => ({
  queryKey: moviesKeys.byGenreList(genreId, page),
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
    queryKey: moviesKeys.byGenreList(genreId, page),
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
  queryKey: moviesKeys.searchedList(query),
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
  queryKey: moviesKeys.similarList(id, page),
  queryFn: () => getSimilarMovies(id, page),
  select: createResultsLimitSelect<Movie, MovieResponse>(limit),
  ...queryConfig.movies,
  enabled: enabled && !!id,
});
