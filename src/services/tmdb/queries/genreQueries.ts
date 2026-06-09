import type { GenreMap } from '@/types/tmdb';
import { queryConfig } from '../queryConfig';
import { genresQueryKey } from '../queryKeys/genreQueryKeys';
import { getMovieGenres } from '../api/genreApi';

// ===== Query Options =====

export const genresQuery = () => ({
  queryKey: genresQueryKey,
  queryFn: () => getMovieGenres(),
  ...queryConfig.genres,
});

export const genreMapQuery = () => ({
  queryKey: genresQueryKey,
  queryFn: () =>
    getMovieGenres().then((data) =>
      data.genres.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {} as GenreMap),
    ),
  ...queryConfig.genres,
});
