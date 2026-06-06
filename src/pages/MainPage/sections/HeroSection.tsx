import HeroCarousel from '../../../components/HeroCarousel/HeroCarousel';
import styles from '../MainPage.module.css';
import type { Movie } from '../../../types/tmdb';

interface HeroSectionProps {
  movies: Movie[];
}

export const HeroSection = ({ movies }: HeroSectionProps) => {
  if (movies.length === 0) {
    return <section className={styles.heroSection}>{<div className={styles.heroSkeleton} />}</section>;
  }

  return (
    <section className={styles.heroSection}>
      <HeroCarousel movies={movies.slice(0, 10)} />
    </section>
  );
};
