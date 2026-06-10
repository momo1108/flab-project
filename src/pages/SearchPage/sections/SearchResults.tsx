import { useEffect, useMemo, useRef } from 'react';
import { useSuspenseInfiniteQuery, useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { movieCreditsQuery } from '@/services/tmdb/queries/movieQueries';
import { searchMoviesQuery } from '@/services/tmdb/queries/moviesQueries';
import type { Movie } from '@/types/tmdb';
import styles from '../SearchPage.module.css';
import { getPosterUrl } from '@/services/tmdb/imageUrls';
import { configurationQueryObj } from '@/services/tmdb/queries/configurationQueries';

interface SearchResultsProps {
  searchQuery: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ searchQuery }) => {
  const { data: config } = useSuspenseQuery(configurationQueryObj);
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

  const movieCreditsQueries = useSuspenseQueries({
    queries: searchResults.map((movie) => movieCreditsQuery(movie.id)),
  });

  const creditsData = movieCreditsQueries.map((q) => q.data);

  const directorNameCache = useMemo(() => {
    const cache = new Map<number, string>();
    creditsData.forEach((credits, index) => {
      const movie = searchResults[index];
      if (!movie) return;

      if (!credits) {
        cache.set(movie.id, '');
        return;
      }

      const director = credits.producer;
      cache.set(movie.id, director?.name ?? '');
    });
    return cache;
  }, [creditsData, searchResults]);

  const renderMetaText = (id: number, release_date: string) => {
    const director = directorNameCache.get(id) ?? '';
    const year = release_date?.substring(0, 4) || '';

    if (director && year) {
      return `${director} · ${year}`;
    }
    if (year) {
      return `${year}`;
    }
    return '';
  };

  return searchResults.length > 0 ? (
    <div className={styles.searchResultsContainer}>
      {searchResults.map(({ id, poster_path, title, release_date }) => (
        <Link key={id} to={`/movie/${id}`} className={styles.searchResultCard}>
          {poster_path ? (
            <img src={getPosterUrl(poster_path, config, 'w200')} alt={title} className={styles.searchResultPoster} />
          ) : (
            <div className={styles.searchResultPosterPlaceholder}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="2" y="2" width="20" height="20" rx="2" />
                <path d="M12 7v10M7 12h10" />
              </svg>
            </div>
          )}
          <div className={styles.searchResultInfo}>
            <div className={styles.searchResultTitle}>{title}</div>
            <div className={styles.searchResultMeta}>{renderMetaText(id, release_date)}</div>
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
  );
};
