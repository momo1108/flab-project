import { useEffect, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { popularMoviesQuery } from '@/services/tmdb/queries/moviesQueries';
import styles from '../SearchPage.module.css';
import { getBackdropUrl } from '@/services/tmdb/imageUrls';
import { configurationQueryObj } from '@/services/tmdb/queries/configurationQueries';
import SectionWrapper from '@/components/SectionWrapper';

export const BackdropSlideshow: React.FC = () => {
  return (
    <SectionWrapper>
      <BackdropSlideshowContent />
    </SectionWrapper>
  );
};

const BackdropSlideshowContent: React.FC = () => {
  const { data: config } = useSuspenseQuery(configurationQueryObj);
  const {
    data: { results: popularMovies },
  } = useSuspenseQuery(popularMoviesQuery(1, 10));
  const [currentBackdropIndex, setCurrentBackdropIndex] = useState(0);

  if (popularMovies.length === 0) {
    return null;
  }

  useEffect(() => {
    if (popularMovies.length === 0) return;

    setCurrentBackdropIndex(0);
    const interval = setInterval(() => {
      setCurrentBackdropIndex((prev) => (prev + 1) % popularMovies.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [popularMovies.length]);

  return (
    <div className={styles.backdropSection}>
      <div className={styles.backdropWrapper}>
        {popularMovies.map(({ id, backdrop_path, title }, index) => (
          <img
            key={id}
            src={getBackdropUrl(backdrop_path, config, 'w780')}
            alt={title}
            className={`${styles.backdropImage} ${index === currentBackdropIndex ? '' : styles.fading}`}
            style={{ display: index === currentBackdropIndex ? 'block' : 'none' }}
          />
        ))}
        <div className={styles.backdropOverlay} />
      </div>
    </div>
  );
};
