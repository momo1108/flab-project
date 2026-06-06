import { Link } from 'react-router';
import type { Movie } from '../../../types/tmdb';
import styles from '../SearchPage.module.css';

interface PopularTop10Props {
  popularMovies: Movie[];
  isLoading: boolean;
}

export const PopularTop10: React.FC<PopularTop10Props> = ({ popularMovies, isLoading }) => {
  return (
    <>
      <h2 className={styles.sectionTitle}>인기 검색어 TOP 10</h2>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <span className={styles.loadingText}>로딩 중...</span>
        </div>
      ) : (
        <div className={styles.popularGrid}>
          {popularMovies.map((movie, index) => (
            <Link key={movie.id} to={`/movie/${movie.id}`} className={styles.popularItem}>
              <span className={styles.popularRank}>{index + 1}</span>
              <span className={styles.popularTitle}>{movie.title}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};
