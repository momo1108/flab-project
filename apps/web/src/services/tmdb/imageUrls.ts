import type { TMDBConfiguration } from '@/types/tmdb';

export const getImageUrl = (
  path: string | null,
  config: TMDBConfiguration | undefined,
  size: 'poster' | 'backdrop' | 'profile' = 'poster',
  defaultSize: string = 'w500',
): string => {
  if (!path) {
    return '/placeholder.png';
  }

  if (!config?.images) {
    console.warn('Image config not found in cache, using default TMDB URL');
    return `https://image.tmdb.org/t/p/${defaultSize}${path}`;
  }

  const baseUrl = config.images.secure_base_url;
  let sizeToUse = defaultSize;

  switch (size) {
    case 'poster':
      sizeToUse = config.images.poster_sizes.includes(defaultSize)
        ? defaultSize
        : config.images.poster_sizes[config.images.poster_sizes.length - 2] || 'w500';
      break;
    case 'backdrop':
      sizeToUse = config.images.backdrop_sizes.includes(defaultSize)
        ? defaultSize
        : config.images.backdrop_sizes[config.images.backdrop_sizes.length - 2] || 'w780';
      break;
    case 'profile':
      sizeToUse = config.images.profile_sizes.includes(defaultSize)
        ? defaultSize
        : config.images.profile_sizes[config.images.profile_sizes.length - 2] || 'w185';
      break;
  }

  return `${baseUrl}${sizeToUse}${path}`;
};

export const getPosterUrl = (
  path: string | null,
  config: TMDBConfiguration | undefined,
  size: string = 'w500',
): string => {
  return getImageUrl(path, config, 'poster', size);
};

export const getBackdropUrl = (
  path: string | null,
  config: TMDBConfiguration | undefined,
  size: string = 'w780',
): string => {
  return getImageUrl(path, config, 'backdrop', size);
};

export const getProfileUrl = (
  path: string | null,
  config: TMDBConfiguration | undefined,
  size: string = 'w185',
): string => {
  return getImageUrl(path, config, 'profile', size);
};
