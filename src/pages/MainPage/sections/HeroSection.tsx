import { useSuspenseQuery } from '@tanstack/react-query';
import { trendingMoviesQuery } from '@/services/tmdb/queries/moviesQueries';
import { configurationQueryObj } from '@/services/tmdb/queries/configurationQueries';
import HeroCarousel from '@/components/HeroCarousel/HeroCarousel';
import styles from '../MainPage.module.css';

export const HeroSection = () => {
  const {
    data: { results: trendingMovies },
  } = useSuspenseQuery(trendingMoviesQuery('day', 10));
  const { data: config } = useSuspenseQuery(configurationQueryObj);

  if (trendingMovies.length === 0) {
    return <section className={styles.heroSection}>{<div className={styles.heroSkeleton} />}</section>;
  }

  return (
    <section className={styles.heroSection}>
      <HeroCarousel movies={trendingMovies} config={config} />
    </section>
  );
};
