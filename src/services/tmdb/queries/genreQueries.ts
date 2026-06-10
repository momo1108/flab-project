import { queryConfig } from '../queryConfig';
import { genresQueryKey } from '../queryKeys/genreQueryKeys';
import { getGenreMap, getMovieGenres } from '../api/genreApi';

// ===== Query Options =====

export const genresQueryObj = {
  queryKey: genresQueryKey,
  queryFn: () => getMovieGenres(),
  ...queryConfig.genres,
};

export const genreMapQueryObj = {
  queryKey: genresQueryKey,
  queryFn: () => getGenreMap(),
  ...queryConfig.genres,
};
