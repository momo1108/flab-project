import type { MovieReviewsResponse } from '@/types/tmdb';
import { queryConfig } from '../queryConfig';
import {
  movieCreditsQueryKey,
  movieDetailQueryKey,
  movieImagesQueryKey,
  movieReviewsQueryKey,
  movieVideosQueryKey,
} from '../queryKeys/movieQueryKeys';
import { getMovieCredits, getMovieDetail, getMovieImages, getMovieReviews, getMovieVideos } from '../api/movieApi';

// ===== Query Options =====

export const movieDetailQuery = (id: number) => ({
  queryKey: movieDetailQueryKey(id),
  queryFn: () => getMovieDetail(id),
  ...queryConfig.movieDetail,
  enabled: !!id,
});

export const movieImagesQuery = (id: number) => ({
  queryKey: movieImagesQueryKey(id),
  queryFn: () => getMovieImages(id),
  ...queryConfig.movieDetail,
  enabled: !!id,
});

export const movieVideosQuery = (id: number) => ({
  queryKey: movieVideosQueryKey(id),
  queryFn: () => getMovieVideos(id),
  ...queryConfig.movies,
  enabled: !!id,
});

export const movieCreditsQuery = (id: number) => ({
  queryKey: movieCreditsQueryKey(id),
  queryFn: () => getMovieCredits(id),
  ...queryConfig.movies,
  enabled: !!id,
});

export const movieReviewsQuery = (id: number, enabled: boolean = true) => ({
  queryKey: movieReviewsQueryKey(id),
  queryFn: ({ pageParam = 1 }: { pageParam?: number }) => getMovieReviews(id, pageParam),
  initialPageParam: 1,
  getNextPageParam: (lastPage: MovieReviewsResponse) => {
    if (lastPage.page >= lastPage.total_pages) return undefined;
    return lastPage.page + 1;
  },
  ...queryConfig.movies,
  enabled: enabled && !!id,
});
