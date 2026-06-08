import { tmdbClient } from './tmdbClient';
import { queryKeys } from './queryKeys';
import { queryConfig } from './queryConfig';
import type { Person, PersonCredits } from '@/types/tmdb';

// ===== API Functions =====

export const getPopularPersons = (page: number = 1): Promise<{ results: Person[] }> => {
  return tmdbClient.request(`/person/popular?page=${page}`);
};

export const getPersonMovieCredits = (personId: number): Promise<PersonCredits> => {
  return tmdbClient.request<PersonCredits>(`/person/${personId}/movie_credits`);
};

// ===== Query Options =====

export const popularPersonsQuery = (page: number = 1) => ({
  queryKey: queryKeys.popularPersons(page),
  queryFn: () => getPopularPersons(page),
  ...queryConfig.movies,
});

export const personCreditsQuery = (personId: number) => ({
  queryKey: queryKeys.personCredits(personId),
  queryFn: () => getPersonMovieCredits(personId),
  ...queryConfig.movieDetail,
  enabled: !!personId,
});
