import { useState, useEffect } from 'react';
import { getBackdropUrl } from '../../utils';
import type { Movie } from '../../types';
import styles from './HeroCarousel.module.css';

interface HeroCarouselProps {
  movies: Movie[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (movies.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [movies.length]);

  if (movies.length === 0) {
    return (
      <div className={styles.heroCarousel}>
        <div className={styles.skeleton} />
      </div>
    );
  }

  // 이미 early return 패턴을 사용했기 때문에 non-null assertion 으로 타입가드 중복 방지
  const currentMovie = movies[currentIndex]!;
  const backdropUrl = getBackdropUrl(currentMovie.backdrop_path, 'original');

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  return (
    <div className={styles.heroCarousel}>
      <div className={styles.slide}>
        <img src={backdropUrl} alt={currentMovie.title} className={styles.backdrop} />
        <div className={styles.overlay} />
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>{currentMovie.title}</h1>
            <p className={styles.overview}>{currentMovie.overview}</p>
            <button className={styles.ctaButton}>감상하기</button>
          </div>
          <div className={styles.indicator}>
            {currentIndex + 1}|{movies.length}
          </div>
        </div>
      </div>

      <button className={`${styles.navButton} ${styles.prevButton}`} onClick={handlePrevious} aria-label="이전 영화">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button className={`${styles.navButton} ${styles.nextButton}`} onClick={handleNext} aria-label="다음 영화">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
};

export default HeroCarousel;
