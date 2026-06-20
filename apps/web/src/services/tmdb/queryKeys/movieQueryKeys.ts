// Category: Single-movie detail queries
export const movieDetailQueryKey = (id: number) => ['movie', 'detail', id] as const;
export const movieImagesQueryKey = (id: number) => ['movie', 'images', id] as const;
export const movieVideosQueryKey = (id: number) => ['movie', 'videos', id] as const;
export const movieCreditsQueryKey = (id: number) => ['movie', 'credits', id] as const;
export const movieReviewsQueryKey = (id: number) => ['movie', 'reviews', id] as const;

// Category: Movie-list queries
export const popularMoviesQueryKey = (page: number) => ['movies', 'popular', page] as const;
export const trendingMoviesQueryKey = (timeWindow: 'day' | 'week') => ['movies', 'trending', timeWindow] as const;
export const discoverMoviesQueryKey = (params: Record<string, string | number>) =>
  ['movies', 'discover', params] as const;
export const similarMoviesQueryKey = (id: number, page: number) => ['movies', 'similar', id, page] as const;
export const searchMoviesQueryKey = (query: string) => ['movies', 'search', query] as const;
export const moviesByGenreQueryKey = (genreId: number, page: number) => ['movies', 'genre', genreId, page] as const;
export const moviesByGenresQueryKey = (genreIds: number[], page: number) =>
  ['movies', 'genres', genreIds, page] as const;
