import { useQuery } from '@tanstack/react-query';
import { tmdbClient } from '../services';
import type { GenreMap } from '../types';

// Query Keys
export const queryKeys = {
  configuration: ['configuration'] as const,
  genres: ['genres'] as const,
  popularMovies: (page: number) => ['popularMovies', page] as const,
  trendingMovies: (timeWindow: 'day' | 'week') => ['trendingMovies', timeWindow] as const,
  discoverMovies: (params: Record<string, string | number>) => ['discoverMovies', params] as const,
  movieDetail: (id: number) => ['movieDetail', id] as const,
  searchMovies: (query: string, page: number) => ['searchMovies', query, page] as const,
  collectionDetail: (id: number) => ['collectionDetail', id] as const,
  popularPersons: (page: number) => ['popularPersons', page] as const,
  personCredits: (personId: number) => ['personCredits', personId] as const,
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

export const useMovieDetail = (id: number) => {
  return useQuery({
    queryKey: queryKeys.movieDetail(id),
    queryFn: () => tmdbClient.getMovieDetail(id),
    ...queryConfig.movieDetail,
    enabled: !!id,
  });
};

export const useSearchMovies = (query: string, page: number = 1) => {
  return useQuery({
    queryKey: queryKeys.searchMovies(query, page),
    queryFn: () => tmdbClient.searchMovies(query, page),
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
