import { useQuery, useQueries, useInfiniteQuery } from '@tanstack/react-query';
import { tmdbClient } from '../services/tmdbClient';
import type { GenreMap } from '../types/tmdb';
import type { MovieResponse } from '../types/tmdb';

// Query Keys
export const queryKeys = {
  configuration: ['configuration'] as const,
  genres: ['genres'] as const,
  popularMovies: (page: number) => ['popularMovies', page] as const,
  trendingMovies: (timeWindow: 'day' | 'week') => ['trendingMovies', timeWindow] as const,
  discoverMovies: (params: Record<string, string | number>) => ['discoverMovies', params] as const,
  moviesByGenre: (genreId: number, page: number) => ['moviesByGenre', genreId, page] as const,
  moviesByGenres: (genreIds: number[], page: number) => ['moviesByGenres', genreIds, page] as const,
  movieDetail: (id: number) => ['movieDetail', id] as const,
  searchMovies: (query: string) => ['searchMovies', query] as const,
  collectionDetail: (id: number) => ['collectionDetail', id] as const,
  popularPersons: (page: number) => ['popularPersons', page] as const,
  personCredits: (personId: number) => ['personCredits', personId] as const,
  movieImages: (id: number) => ['movieImages', id] as const,
  movieVideos: (id: number) => ['movieVideos', id] as const,
  movieCredits: (id: number) => ['movieCredits', id] as const,
  movieReviews: (id: number, page: number) => ['movieReviews', id, page] as const,
  similarMovies: (id: number, page: number) => ['similarMovies', id, page] as const,
};

// Query Configurations
const queryConfig = {
  configuration: {
    staleTime: 1000 * 60 * 60 * 24, // 1일
    retry: 1,
  },
  genres: {
    staleTime: 1000 * 60 * 60 * 24, // 1일
    retry: 1,
  },
  movies: {
    staleTime: 1000 * 60 * 5, // 5분
    retry: 1,
  },
  movieDetail: {
    staleTime: 1000 * 60 * 10, // 10분
    retry: 1,
  },
  search: {
    staleTime: 1000 * 60 * 3, // 3분
    retry: 1,
  },
};

// Hooks
export const useTMDBConfiguration = () => {
  return useQuery({
    queryKey: queryKeys.configuration,
    queryFn: () => tmdbClient.getConfiguration(),
    ...queryConfig.configuration,
  });
};

export const useMovieGenres = () => {
  return useQuery({
    queryKey: queryKeys.genres,
    queryFn: () => tmdbClient.getMovieGenres(),
    ...queryConfig.genres,
  });
};

export const useGenreMap = (): GenreMap => {
  const { data: genresData } = useMovieGenres();

  if (!genresData) {
    return {};
  }

  return genresData.genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {} as GenreMap);
};

export const usePopularMovies = (page: number = 1) => {
  return useQuery({
    queryKey: queryKeys.popularMovies(page),
    queryFn: () => tmdbClient.getPopularMovies(page),
    ...queryConfig.movies,
  });
};

export const useTrendingMovies = (timeWindow: 'day' | 'week' = 'day') => {
  return useQuery({
    queryKey: queryKeys.trendingMovies(timeWindow),
    queryFn: () => tmdbClient.getTrendingMovies(timeWindow),
    ...queryConfig.movies,
  });
};

export const useDiscoverMovies = (params: Record<string, string | number>) => {
  return useQuery({
    queryKey: queryKeys.discoverMovies(params),
    queryFn: () => tmdbClient.discoverMovies(params),
    ...queryConfig.movies,
  });
};

export const useMoviesByGenre = (genreId: number, page: number = 1) => {
  return useQuery({
    queryKey: queryKeys.moviesByGenre(genreId, page),
    queryFn: () =>
      tmdbClient.discoverMovies({
        with_genres: String(genreId),
        sort_by: 'popularity.desc',
        page,
      }),
    ...queryConfig.movies,
    enabled: !!genreId,
  });
};

export const useMoviesByGenres = (genreIds: number[], page: number = 1) => {
  return useQueries({
    queries: genreIds.map((genreId) => ({
      queryKey: queryKeys.moviesByGenre(genreId, page),
      queryFn: () =>
        tmdbClient.discoverMovies({
          with_genres: String(genreId),
          sort_by: 'primary_release_date.desc',
          page,
        }),
      ...queryConfig.movies,
      enabled: !!genreId,
    })),
  });
};

export const useMovieDetail = (id: number) => {
  return useQuery({
    queryKey: queryKeys.movieDetail(id),
    queryFn: () => tmdbClient.getMovieDetail(id),
    ...queryConfig.movieDetail,
    enabled: !!id,
  });
};

export const useSearchMovies = (query: string) => {
  return useInfiniteQuery({
    queryKey: queryKeys.searchMovies(query),
    queryFn: ({ pageParam = 1 }) => tmdbClient.searchMovies(query, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage: MovieResponse) => {
      if (lastPage.page >= lastPage.total_pages) return undefined;
      return lastPage.page + 1;
    },
    ...queryConfig.search,
    enabled: query.length > 0,
  });
};

export const useCollectionDetail = (id: number) => {
  return useQuery({
    queryKey: queryKeys.collectionDetail(id),
    queryFn: () => tmdbClient.getCollectionDetail(id),
    ...queryConfig.movies,
    enabled: !!id,
  });
};

export const usePopularPersons = (page: number = 1) => {
  return useQuery({
    queryKey: queryKeys.popularPersons(page),
    queryFn: () => tmdbClient.getPopularPersons(page),
    ...queryConfig.movies,
  });
};

export const usePersonMovieCredits = (personId: number) => {
  return useQuery({
    queryKey: queryKeys.personCredits(personId),
    queryFn: () => tmdbClient.getPersonMovieCredits(personId),
    ...queryConfig.movieDetail,
    enabled: !!personId,
  });
};

export const useMovieImages = (id: number) => {
  return useQuery({
    queryKey: queryKeys.movieImages(id),
    queryFn: () => tmdbClient.getMovieImages(id),
    ...queryConfig.movieDetail,
    enabled: !!id,
  });
};

export const useMovieVideos = (id: number) => {
  return useQuery({
    queryKey: queryKeys.movieVideos(id),
    queryFn: () => tmdbClient.getMovieVideos(id),
    ...queryConfig.movies,
    enabled: !!id,
  });
};

export const useMovieCredits = (id: number) => {
  return useQuery({
    queryKey: queryKeys.movieCredits(id),
    queryFn: () => tmdbClient.getMovieCredits(id),
    ...queryConfig.movies,
    enabled: !!id,
  });
};

export const useMovieReviews = (id: number, page: number = 1, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.movieReviews(id, page),
    queryFn: () => tmdbClient.getMovieReviews(id, page),
    ...queryConfig.movies,
    enabled: enabled && !!id,
  });
};

export const useSimilarMovies = (id: number, page: number = 1, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.similarMovies(id, page),
    queryFn: () => tmdbClient.getSimilarMovies(id, page),
    ...queryConfig.movies,
    enabled: enabled && !!id,
  });
};
