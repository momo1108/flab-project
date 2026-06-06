// Query Configurations for TMDB API
export const queryConfig = {
  configuration: {
    staleTime: 1000 * 60 * 60 * 24, // 1일
    retry: 1,
  },
  genres: {
    staleTime: 1000 * 60 * 60 * 24, // 1일
    retry: 1,
  },
  movies: {
    staleTime: 1000 * 60 * 5, // 5분
    retry: 1,
  },
  movieDetail: {
    staleTime: 1000 * 60 * 10, // 10분
    retry: 1,
  },
  search: {
    staleTime: 1000 * 60 * 3, // 3분
    retry: 1,
  },
};
