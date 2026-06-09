import { tmdbClient } from '../tmdbClient';
import type {
  MovieDetail,
  MovieImages,
  MovieVideosResponse,
  MovieCreditsResponse,
  MovieReviewsResponse,
} from '@/types/tmdb';

// ===== API Functions =====

export const getMovieDetail = (id: number): Promise<MovieDetail> => {
  return tmdbClient.request<MovieDetail>(`/movie/${id}`);
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
