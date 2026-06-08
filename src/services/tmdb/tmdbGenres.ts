import { tmdbClient } from './tmdbClient';
import { queryKeys } from './queryKeys';
import { queryConfig } from './queryConfig';
import type { GenreResponse, GenreMap } from '@/types/tmdb';

// ===== API Functions =====

export const getMovieGenres = (): Promise<GenreResponse> => {
  return tmdbClient.request<GenreResponse>('/genre/movie/list');
};

export const getGenreMap = async (): Promise<GenreMap> => {
  const data = await getMovieGenres();
  return data.genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {} as GenreMap);
};

// ===== Query Options =====

export const genresQuery = () => ({
  queryKey: queryKeys.genres,
  queryFn: () => getMovieGenres(),
  ...queryConfig.genres,
});

export const genreMapQuery = () => ({
  queryKey: queryKeys.genres,
  queryFn: () =>
    getMovieGenres().then((data) =>
      data.genres.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {} as GenreMap),
    ),
  ...queryConfig.genres,
});
