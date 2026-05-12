import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getBackdropUrl } from '../../utils/image';
import type { Movie } from '../../types/tmdb';
import styles from './HeroCarousel.module.css';

interface HeroCarouselProps {
  movies: Movie[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ movies }) => {
  const navigate = useNavigate();

  // displayIndex: 1 = 첫 번째 실제 슬라이드 (0은 마지막 클론, movies.length+1은 첫 클론)
  const [displayIndex, setDisplayIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (movies.length === 0 || isPaused) return;
    const timer = setInterval(() => {
      setDisplayIndex((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, [movies.length, isPaused]);

  useEffect(() => {
    if (!isAnimating) {
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
      return () => cancelAnimationFrame(id);
    }
  }, [isAnimating]);

  if (movies.length === 0) {
    return (
      <div className={styles.heroCarousel}>
        <div className={styles.skeleton} />
      </div>
    );
  }

  // [마지막 클론, ...실제 슬라이드들, 첫 번째 클론]
  const extendedMovies = [movies[movies.length - 1]!, ...movies, movies[0]!];
  // 실제 인덱스 (인디케이터/텍스트용)
  const realIndex = (((displayIndex - 1) % movies.length) + movies.length) % movies.length;
  const currentMovie = movies[realIndex]!;

  const handleNext = () => setDisplayIndex((prev) => prev + 1);
  const handlePrevious = () => setDisplayIndex((prev) => prev - 1);

  const handleTransitionEnd = () => {
    if (displayIndex >= movies.length + 1) {
      // 첫 번째 클론에 도달 → 실제 첫 번째로 무음 점프
      setIsAnimating(false);
      setDisplayIndex(1);
    } else if (displayIndex <= 0) {
      // 마지막 클론에 도달 → 실제 마지막으로 무음 점프
      setIsAnimating(false);
      setDisplayIndex(movies.length);
    }
  };

  return (
    <div className={styles.heroCarousel} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className={styles.slidesClip}>
        <div className={styles.slidesViewport}>
          <div
            className={styles.slidesContainer}
            style={{
              transform: `translateX(${displayIndex * -100}%)`,
              transition: isAnimating ? undefined : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedMovies.map((movie, i) => {
              const url = getBackdropUrl(movie.backdrop_path, 'original');
              return (
                <div key={`${movie.id}-${i}`} className={styles.slide} onClick={() => navigate(`/movie/${movie.id}`)}>
                  <img src={url} alt={movie.title} className={styles.backdrop} />
                  <div className={styles.overlay} />
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>{currentMovie.title}</h1>
            <p className={styles.overview}>{currentMovie.overview}</p>
            <button className={styles.ctaButton} onClick={() => navigate(`/movie/${currentMovie.id}`)}>
              감상하기
            </button>
          </div>
          <div className={styles.indicator}>
            {realIndex + 1}
            <span className={styles.totalSpan}> | {movies.length}</span>
          </div>
        </div>

        <button className={`${styles.navButton} ${styles.prevButton}`} onClick={handlePrevious} aria-label="이전 영화">
          <svg
            className={styles.navIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            preserveAspectRatio="none"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button className={`${styles.navButton} ${styles.nextButton}`} onClick={handleNext} aria-label="다음 영화">
          <svg
            className={styles.navIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            preserveAspectRatio="none"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HeroCarousel;
