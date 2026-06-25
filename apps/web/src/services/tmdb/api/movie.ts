import { tmdbClient } from '../tmdbClient';
import type {
  MovieDetail,
  MovieImages,
  MovieVideosResponse,
  MovieCreditsResponse,
  MovieReviewsResponse,
} from '@/types/tmdb';

// ===== API Functions =====

export const getMovieDetail = (id: number): Promise<MovieDetail> => tmdbClient.request<MovieDetail>(`/movie/${id}`);

export const getMovieImages = (id: number): Promise<MovieImages> =>
  tmdbClient.request<MovieImages>(`/movie/${id}/images`);

export const getMovieVideos = (id: number): Promise<MovieVideosResponse> =>
  tmdbClient.request<MovieVideosResponse>(`/movie/${id}/videos`);

export const getMovieCredits = (id: number): Promise<MovieCreditsResponse> =>
  tmdbClient.request<MovieCreditsResponse>(`/movie/${id}/credits`);

export const getMovieReviews = (id: number, page: number = 1): Promise<MovieReviewsResponse> =>
  tmdbClient.request<MovieReviewsResponse>(`/movie/${id}/reviews?page=${page}`);
