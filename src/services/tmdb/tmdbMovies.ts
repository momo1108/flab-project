import { tmdbClient } from './tmdbClient';
import { queryKeys } from './queryKeys';
import { queryConfig } from './queryConfig';
import type {
  MovieResponse,
  MovieDetail,
  SearchResponse,
  MovieImages,
  MovieVideosResponse,
  MovieCreditsResponse,
  MovieReviewsResponse,
  SimilarMoviesResponse,
} from '../../types/tmdb';
import { getLocalDateString } from '../../utils/format';

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

export const getMovieDetail = (id: number): Promise<MovieDetail> => {
  return tmdbClient.request<MovieDetail>(`/movie/${id}`);
};

export const searchMovies = (query: string, page: number = 1): Promise<SearchResponse> => {
  return tmdbClient.request<SearchResponse>(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
};

export const getMovieImages = (id: number): Promise<MovieImages> => {
  return tmdbClient.request<MovieImages>(`/movie/${id}/images`);
};

export const getMovieVideos = (id: number): Promise<MovieVideosResponse> => {
  return tmdbClient.request<MovieVideosResponse>(`/movie/${id}/videos`);
};

export const getMovieCredits = (id: number): Promise<MovieCreditsResponse> => {
  return tmdbClient.request<MovieCreditsResponse>(`/movie/${id}/credits`);
};

export const getMovieReviews = (id: number, page: number = 1): Promise<MovieReviewsResponse> => {
  return tmdbClient.request<MovieReviewsResponse>(`/movie/${id}/reviews?page=${page}`);
};

export const getSimilarMovies = (id: number, page: number = 1): Promise<SimilarMoviesResponse> => {
  return tmdbClient.request<SimilarMoviesResponse>(`/movie/${id}/similar?page=${page}`);
};

// ===== Query Options =====

export const popularMoviesQuery = (page: number = 1) => ({
  queryKey: queryKeys.popularMovies(page),
  queryFn: () => getPopularMovies(page),
  ...queryConfig.movies,
});

export const trendingMoviesQuery = (timeWindow: 'day' | 'week' = 'day') => ({
  queryKey: queryKeys.trendingMovies(timeWindow),
  queryFn: () => getTrendingMovies(timeWindow),
  ...queryConfig.movies,
});

export const discoverMoviesQuery = (params: Record<string, string | number>) => ({
  queryKey: queryKeys.discoverMovies(params),
  queryFn: () => discoverMovies(params),
  ...queryConfig.movies,
});

export const moviesByGenreQuery = (genreId: number, page: number = 1) => ({
  queryKey: queryKeys.moviesByGenre(genreId, page),
  queryFn: () =>
    discoverMovies({
      with_genres: String(genreId),
      sort_by: 'popularity.desc',
      page,
    }),
  ...queryConfig.movies,
  enabled: !!genreId,
});

export const moviesByGenresQuery = (genreIds: number[], page: number = 1) => {
  return genreIds.map((genreId) => ({
    queryKey: queryKeys.moviesByGenre(genreId, page),
    queryFn: () =>
      discoverMovies({
        with_genres: String(genreId),
        sort_by: 'primary_release_date.desc',
        page,
      }),
    ...queryConfig.movies,
    enabled: !!genreId,
  }));
};

export const movieDetailQuery = (id: number) => ({
  queryKey: queryKeys.movieDetail(id),
  queryFn: () => getMovieDetail(id),
  ...queryConfig.movieDetail,
  enabled: !!id,
});

export const searchMoviesQuery = (query: string) => ({
  queryKey: queryKeys.searchMovies(query),
  queryFn: ({ pageParam = 1 }: { pageParam?: number }) => searchMovies(query, pageParam),
  initialPageParam: 1,
  getNextPageParam: (lastPage: MovieResponse) => {
    if (lastPage.page >= lastPage.total_pages) return undefined;
    return lastPage.page + 1;
  },
  ...queryConfig.search,
  enabled: query.length > 0,
});

export const movieImagesQuery = (id: number) => ({
  queryKey: queryKeys.movieImages(id),
  queryFn: () => getMovieImages(id),
  ...queryConfig.movieDetail,
  enabled: !!id,
});

export const movieVideosQuery = (id: number) => ({
  queryKey: queryKeys.movieVideos(id),
  queryFn: () => getMovieVideos(id),
  ...queryConfig.movies,
  enabled: !!id,
});

export const movieCreditsQuery = (id: number) => ({
  queryKey: queryKeys.movieCredits(id),
  queryFn: () => getMovieCredits(id),
  ...queryConfig.movies,
  enabled: !!id,
});

export const movieReviewsQuery = (id: number, enabled: boolean = true) => ({
  queryKey: queryKeys.movieReviews(id),
  queryFn: ({ pageParam = 1 }: { pageParam?: number }) => getMovieReviews(id, pageParam),
  initialPageParam: 1,
  getNextPageParam: (lastPage: MovieReviewsResponse) => {
    if (lastPage.page >= lastPage.total_pages) return undefined;
    return lastPage.page + 1;
  },
  ...queryConfig.movies,
  enabled: enabled && !!id,
});

export const similarMoviesQuery = (id: number, page: number = 1, enabled: boolean = true) => ({
  queryKey: queryKeys.similarMovies(id, page),
  queryFn: () => getSimilarMovies(id, page),
  ...queryConfig.movies,
  enabled: enabled && !!id,
});
