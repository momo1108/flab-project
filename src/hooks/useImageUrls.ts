import { useQuery } from '@tanstack/react-query';
import { configurationQuery } from '../services/tmdb/tmdbConfiguration';

export const useImageUrls = () => {
  // Automatically fetch config if not in cache
  const { data: config } = useQuery(configurationQuery());

  const getImageUrl = (
    path: string | null,
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

  const getPosterUrl = (path: string | null, size: string = 'w500'): string => {
    return getImageUrl(path, 'poster', size);
  };

  const getBackdropUrl = (path: string | null, size: string = 'w780'): string => {
    return getImageUrl(path, 'backdrop', size);
  };

  const getProfileUrl = (path: string | null, size: string = 'w185'): string => {
    return getImageUrl(path, 'profile', size);
  };

  return {
    getImageUrl,
    getPosterUrl,
    getBackdropUrl,
    getProfileUrl,
  };
};
