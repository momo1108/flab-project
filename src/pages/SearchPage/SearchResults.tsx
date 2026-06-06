import { Link } from 'react-router';
import type { Movie } from '../../types/tmdb';
import { useImageUrls } from '../../hooks/useImageUrls';
import styles from './SearchPage.module.css';

interface SearchResultsProps {
  searchResults: Movie[];
  searchLoading: boolean;
  hasMore: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  getDirectorName: (movie: Movie) => string;
  isFetchingNextPage: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  searchResults,
  searchLoading,
  hasMore,
  loadMoreRef,
  getDirectorName,
  isFetchingNextPage,
}) => {
  const { getImageUrl } = useImageUrls();
  const getReleaseYear = (movie: Movie) => {
    return movie.release_date?.substring(0, 4) || '';
  };

  const renderMetaText = (movie: Movie) => {
    const director = getDirectorName(movie);
    const year = getReleaseYear(movie);

    if (director && year) {
      return `${director} · ${year}`;
    }
    if (year) {
      return `${year}`;
    }
    return '';
  };

  return (
    <>
      {searchLoading && searchResults.length === 0 ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <span className={styles.loadingText}>검색 중...</span>
        </div>
      ) : searchResults.length > 0 ? (
        <div className={styles.searchResultsContainer}>
          {searchResults.map((movie) => (
            <Link key={movie.id} to={`/movie/${movie.id}`} className={styles.searchResultCard}>
              {movie.poster_path ? (
                <img
                  src={getImageUrl(movie.poster_path, 'poster', 'w200')}
                  alt={movie.title}
                  className={styles.searchResultPoster}
                />
              ) : (
                <div className={styles.searchResultPosterPlaceholder}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="2" y="2" width="20" height="20" rx="2" />
                    <path d="M12 7v10M7 12h10" />
                  </svg>
                </div>
              )}
              <div className={styles.searchResultInfo}>
                <div className={styles.searchResultTitle}>{movie.title}</div>
                <div className={styles.searchResultMeta}>{renderMetaText(movie)}</div>
              </div>
            </Link>
          ))}
          {hasMore && (
            <div ref={loadMoreRef} className={styles.loadMoreTrigger}>
              {isFetchingNextPage && <div className={styles.loadingSpinner} style={{ width: 24, height: 24 }} />}
            </div>
          )}
        </div>
      ) : (
        !searchLoading && (
          <div className={styles.emptyState}>
            <p>검색 결과가 없습니다</p>
          </div>
        )
      )}
    </>
  );
};
