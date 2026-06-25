import { queryConfig } from '../queryConfig';
import { personKeys } from '../queryKeys/person';
import { getPopularPersons } from '../api/person';

// ===== Query Options =====

export const popularPersonsQuery = (page: number = 1) => ({
  queryKey: personKeys.popularList(page),
  queryFn: () => getPopularPersons(page),
  ...queryConfig.movies,
});
