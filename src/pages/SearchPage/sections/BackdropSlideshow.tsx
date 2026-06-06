import { useEffect, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { popularMoviesQuery } from '../../../services/tmdb/tmdbMovies';
import { useImageUrls } from '../../../hooks/useImageUrls';
import styles from '../SearchPage.module.css';

export const BackdropSlideshow: React.FC = () => {
  const { getImageUrl } = useImageUrls();
  const { data: popularData } = useSuspenseQuery(popularMoviesQuery(1));
  const popularMovies = popularData.results.slice(0, 10);
  const [currentBackdropIndex, setCurrentBackdropIndex] = useState(0);

  if (popularMovies.length === 0) {
    return null;
  }

  useEffect(() => {
    if (popularMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBackdropIndex((prev) => (prev + 1) % popularMovies.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [popularMovies]);

  return (
    <div className={styles.backdropSection}>
      <div className={styles.backdropWrapper}>
        {popularMovies.map((movie, index) => (
          <img
            key={movie.id}
            src={getImageUrl(movie.backdrop_path, 'backdrop', 'w780')}
            alt={movie.title}
            className={`${styles.backdropImage} ${index === currentBackdropIndex ? '' : styles.fading}`}
            style={{ display: index === currentBackdropIndex ? 'block' : 'none' }}
          />
        ))}
        <div className={styles.backdropOverlay} />
      </div>
    </div>
  );
};
