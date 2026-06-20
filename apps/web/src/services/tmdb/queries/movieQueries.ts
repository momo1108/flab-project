import type {
  CastMember,
  CrewMember,
  MovieCreditsResponse,
  MovieReviewsResponse,
  MovieVideosResponse,
} from '@/types/tmdb';
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
  select: (data: MovieVideosResponse) => {
    const youtubeVideos = data.results.filter((v) => v.site === 'YouTube').slice(0, 4);

    return { ...data, youtubeVideos };
  },
  ...queryConfig.movies,
  enabled: !!id,
});

export const movieCreditsQuery = (id: number) => ({
  queryKey: movieCreditsQueryKey(id),
  queryFn: () => getMovieCredits(id),
  select: (data: MovieCreditsResponse) => {
    const { crew, cast } = data;

    const producer: CrewMember | undefined =
      crew.find((c) => c.job === 'Executive Producer') ??
      crew.find((c) => c.job === 'Producer') ??
      crew.find((c) => c.job === 'Director');

    let top10Cast: CastMember[] = cast.map((cast) => ({ ...cast }));
    top10Cast.sort((a, b) => a.order - b.order);
    top10Cast = top10Cast.slice(0, 10);

    return { ...data, producer, top10Cast };
  },
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
