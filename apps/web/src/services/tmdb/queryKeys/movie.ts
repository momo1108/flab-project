export const movieKeys = {
  all: ['movie'] as const,
  details: () => [...movieKeys.all, 'detail'] as const,
  detail: (movieId: number) => [...movieKeys.details(), movieId] as const,
  images: () => [...movieKeys.all, 'image'] as const,
  image: (movieId: number) => [...movieKeys.images(), movieId] as const,
  videos: () => [...movieKeys.all, 'video'] as const,
  video: (movieId: number) => [...movieKeys.videos(), movieId] as const,
  credits: () => [...movieKeys.all, 'credit'] as const,
  credit: (movieId: number) => [...movieKeys.credits(), movieId] as const,
  reviews: () => [...movieKeys.all, 'review'] as const,
  review: (movieId: number) => [...movieKeys.reviews(), movieId] as const,
};
