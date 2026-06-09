import { tmdbClient } from '../tmdbClient';
import type { Person, PersonCredits } from '@/types/tmdb';

// ===== API Functions =====

export const getPopularPersons = (page: number = 1): Promise<{ results: Person[] }> => {
  return tmdbClient.request(`/person/popular?page=${page}`);
};

export const getPersonMovieCredits = (personId: number): Promise<PersonCredits> => {
  return tmdbClient.request<PersonCredits>(`/person/${personId}/movie_credits`);
};
