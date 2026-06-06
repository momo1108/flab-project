import { Link } from 'react-router';
import type { Movie } from '../../types/tmdb';
import { useImageUrls } from '../../hooks/useImageUrls';
import styles from './MovieDetailPage.module.css';

interface RelatedContentTabProps {
  similarMovies: Movie[];
  isSimilarLoading: boolean;
}

export const RelatedContentTab: React.FC<RelatedContentTabProps> = ({ similarMovies, isSimilarLoading }) => {
  const { getImageUrl } = useImageUrls();
  const displaySimilarMovies = similarMovies.slice(0, 16);

  return (
    <div className={`${styles.tabContent} ${styles.active}`}>
      <h2 className={styles.sectionTitle}>관련 콘텐츠</h2>
      {isSimilarLoading ? (
        <div className={styles.loading}>
          <div className="spinner" />
          <p className={styles.loadingText}>로딩 중...</p>
        </div>
      ) : displaySimilarMovies.length > 0 ? (
        <div className={styles.similarMoviesGrid}>
          {displaySimilarMovies.map((similarMovie) => (
            <Link key={similarMovie.id} to={`/movie/${similarMovie.id}`} className={styles.similarMovieItem}>
              <img
                src={getImageUrl(similarMovie.poster_path, 'poster', 'w500')}
                alt={similarMovie.title}
                className={styles.similarMoviePoster}
              />
            </Link>
          ))}
        </div>
      ) : (
        <p className={styles.emptyState}>관련 영화가 없습니다.</p>
      )}
    </div>
  );
};
