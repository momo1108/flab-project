import { useEffect, useMemo, useRef } from 'react';
import { useQueries, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { movieCreditsQuery } from '@/services/tmdb/queries/movieQueries';
import { searchMoviesQuery } from '@/services/tmdb/queries/moviesQueries';
import type { Movie, MovieCreditsResponse } from '@/types/tmdb';
import { useImageUrls } from '@/hooks/useImageUrls';
import styles from '../SearchPage.module.css';

interface SearchResultsProps {
  searchQuery: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ searchQuery }) => {
  const { getImageUrl } = useImageUrls();

  const {
    data: searchMoviesData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(searchMoviesQuery(searchQuery));

  const searchResults = useMemo(() => {
    return searchMoviesData.pages.reduce<Movie[]>((acc, page) => [...acc, ...page.results], []);
  }, [searchMoviesData.pages]);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  const movieCreditsQueries = useQueries({
    queries: searchResults.map((movie) => movieCreditsQuery(movie.id)),
  });

  const creditsData = movieCreditsQueries.map((q) => q.data) as MovieCreditsResponse[];

  const directorNameCache = useMemo(() => {
    const cache = new Map<number, string>();
    creditsData.forEach((credits, index) => {
      const movie = searchResults[index];
      if (!movie) return;

      if (!credits) {
        cache.set(movie.id, '');
        return;
      }

      const director = credits.crew.find((c) => c.job === 'Director');
      cache.set(movie.id, director?.name ?? '');
    });
    return cache;
  }, [creditsData, searchResults]);

  const getDirectorName = (movie: Movie): string => {
    return directorNameCache.get(movie.id) ?? '';
  };

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
      {searchResults.length > 0 ? (
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
          {hasNextPage && (
            <div ref={loadMoreRef} className={styles.loadMoreTrigger}>
              {isFetchingNextPage && <div className={styles.loadingSpinner} style={{ width: 24, height: 24 }} />}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>검색 결과가 없습니다</p>
        </div>
      )}
    </>
  );
};
