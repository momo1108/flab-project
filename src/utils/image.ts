import type { TMDBConfiguration } from '../types';

let imageConfig: TMDBConfiguration['images'] | null = null;

export const setImageConfig = (config: TMDBConfiguration['images']) => {
  imageConfig = config;
};

export const getImageUrl = (
  path: string | null,
  size: 'poster' | 'backdrop' | 'profile' = 'poster',
  defaultSize: string = 'w500',
): string => {
  if (!path) {
    return '/placeholder.jpg';
  }

  if (!imageConfig) {
    console.warn('Image config not set, using default TMDB URL');
    return `https://image.tmdb.org/t/p/${defaultSize}${path}`;
  }

  const baseUrl = imageConfig.secure_base_url;
  let sizeToUse = defaultSize;

  switch (size) {
    case 'poster':
      sizeToUse = imageConfig.poster_sizes.includes(defaultSize)
        ? defaultSize
        : imageConfig.poster_sizes[imageConfig.poster_sizes.length - 2] || 'w500';
      break;
    case 'backdrop':
      sizeToUse = imageConfig.backdrop_sizes.includes(defaultSize)
        ? defaultSize
        : imageConfig.backdrop_sizes[imageConfig.backdrop_sizes.length - 2] || 'w780';
      break;
    case 'profile':
      sizeToUse = imageConfig.profile_sizes.includes(defaultSize)
        ? defaultSize
        : imageConfig.profile_sizes[imageConfig.profile_sizes.length - 2] || 'w185';
      break;
  }

  return `${baseUrl}${sizeToUse}${path}`;
};

export const getPosterUrl = (path: string | null, size: string = 'w500'): string => {
  return getImageUrl(path, 'poster', size);
};

export const getBackdropUrl = (path: string | null, size: string = 'w780'): string => {
  return getImageUrl(path, 'backdrop', size);
};

export const getProfileUrl = (path: string | null, size: string = 'w185'): string => {
  return getImageUrl(path, 'profile', size);
};
