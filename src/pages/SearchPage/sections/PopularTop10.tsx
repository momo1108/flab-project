import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { popularMoviesQuery } from '../../../services/tmdb/tmdbMovies';
import styles from '../SearchPage.module.css';

export const PopularTop10: React.FC = () => {
  const { data: popularData } = useSuspenseQuery(popularMoviesQuery(1));
  const popularMovies = popularData.results.slice(0, 10);

  return (
    <div className={styles.popularGrid}>
      {popularMovies.map((movie, index) => (
        <Link key={movie.id} to={`/movie/${movie.id}`} className={styles.popularItem}>
          <span className={styles.popularRank}>{index + 1}</span>
          <span className={styles.popularTitle}>{movie.title}</span>
        </Link>
      ))}
    </div>
  );
};
