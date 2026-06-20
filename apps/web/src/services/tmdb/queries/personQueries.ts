import { queryConfig } from '../queryConfig';
import { personCreditsQueryKey, popularPersonsQueryKey } from '../queryKeys/personQueryKeys';
import { getPersonMovieCredits, getPopularPersons } from '../api/personApi';

// ===== Query Options =====

export const popularPersonsQuery = (page: number = 1) => ({
  queryKey: popularPersonsQueryKey(page),
  queryFn: () => getPopularPersons(page),
  ...queryConfig.movies,
});

export const personCreditsQuery = (personId: number) => ({
  queryKey: personCreditsQueryKey(personId),
  queryFn: () => getPersonMovieCredits(personId),
  ...queryConfig.movieDetail,
  enabled: !!personId,
});
