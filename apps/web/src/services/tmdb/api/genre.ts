import { tmdbClient } from '../tmdbClient';
import type { GenreResponse, GenreMap } from '@/types/tmdb';

// ===== API Functions =====

export const getMovieGenres = (): Promise<GenreResponse> => tmdbClient.request<GenreResponse>('/genre/movie/list');

export const getGenreMap = async (): Promise<GenreMap> => {
  const data = await getMovieGenres();
  return data.genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {} as GenreMap);
};
