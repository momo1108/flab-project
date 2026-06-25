import { tmdbClient } from '../tmdbClient';
import type { Person } from '@/types/tmdb';

// ===== API Functions =====

export const getPopularPersons = (page: number = 1): Promise<{ results: Person[] }> =>
  tmdbClient.request(`/person/popular?page=${page}`);
