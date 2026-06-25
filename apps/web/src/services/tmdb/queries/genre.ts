import { queryConfig } from '../queryConfig';
import { genreKeys } from '../queryKeys/genre';
import { getGenreMap, getMovieGenres } from '../api/genre';

// ===== Query Options =====

export const genresQueryObj = {
  queryKey: genreKeys.all,
  queryFn: () => getMovieGenres(),
  ...queryConfig.genres,
};

export const genreMapQueryObj = {
  queryKey: genreKeys.all,
  queryFn: () => getGenreMap(),
  ...queryConfig.genres,
};
