import { useSuspenseQuery } from '@tanstack/react-query';
import { trendingMoviesQuery } from '@/services/tmdb/queries/moviesQueries';
import HeroCarousel from '@/components/HeroCarousel/HeroCarousel';
import styles from '../MainPage.module.css';
import { useMemo } from 'react';

export const HeroSection = () => {
  const { data: trendingData } = useSuspenseQuery(trendingMoviesQuery('day'));
  const trendingMovies = useMemo(() => {
    return trendingData.results.slice(0, 10);
  }, [trendingData]);

  if (trendingMovies.length === 0) {
    return <section className={styles.heroSection}>{<div className={styles.heroSkeleton} />}</section>;
  }

  return (
    <section className={styles.heroSection}>
      <HeroCarousel movies={trendingMovies} />
    </section>
  );
};
