import { useEffect, useState } from 'react';
import type { Movie } from '../../../types/tmdb';
import { useImageUrls } from '../../../hooks/useImageUrls';
import styles from '../SearchPage.module.css';

interface BackdropSlideshowProps {
  popularMovies: Movie[];
}

export const BackdropSlideshow: React.FC<BackdropSlideshowProps> = ({ popularMovies }) => {
  const { getImageUrl } = useImageUrls();
  const [currentBackdropIndex, setCurrentBackdropIndex] = useState(0);

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
