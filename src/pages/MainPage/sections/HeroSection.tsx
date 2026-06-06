import { useSuspenseQuery } from '@tanstack/react-query';
import { trendingMoviesQuery } from '../../../services/tmdb/tmdbMovies';
import HeroCarousel from '../../../components/HeroCarousel/HeroCarousel';
import styles from '../MainPage.module.css';

export const HeroSection = () => {
  const { data: trendingData } = useSuspenseQuery(trendingMoviesQuery('day'));
  const trendingMovies = trendingData.results.slice(0, 10);

  if (trendingMovies.length === 0) {
    return <section className={styles.heroSection}>{<div className={styles.heroSkeleton} />}</section>;
  }

  return (
    <section className={styles.heroSection}>
      <HeroCarousel movies={trendingMovies.slice(0, 10)} />
    </section>
  );
};
