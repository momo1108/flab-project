import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { popularMoviesQuery } from '@/services/tmdb/queries/moviesQueries';
import styles from '../SearchPage.module.css';

export const PopularTop10: React.FC = () => {
  const {
    data: { results: popularMovies },
  } = useSuspenseQuery(popularMoviesQuery(1, 10));

  return (
    <div className={styles.popularGrid}>
      {popularMovies.map(({ id, title }, index) => (
        <Link key={id} to={`/movie/${id}`} className={styles.popularItem}>
          <span className={styles.popularRank}>{index + 1}</span>
          <span className={styles.popularTitle}>{title}</span>
        </Link>
      ))}
    </div>
  );
};
