import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router';
import {
  useTMDBConfiguration,
  usePopularMovies,
  useSearchMovies,
  useMoviesByGenres,
  useMovieGenres,
} from '../../hooks/useTMDB';
import { setImageConfig } from '../../utils/image';
import { getImageUrl } from '../../utils/image';
import styles from './SearchPage.module.css';
import type { Movie } from '../../types/tmdb';

const SearchPage: React.FC = () => {
  // API Configuration
  const { data: config } = useTMDBConfiguration();

  // Initialize image config
  useEffect(() => {
    if (config?.images) {
      setImageConfig(config.images);
    }
  }, [config]);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debouncedQueryRef = useRef(debouncedQuery);

  // Update ref when debouncedQuery changes
  useEffect(() => {
    debouncedQueryRef.current = debouncedQuery;
  }, [debouncedQuery]);

  // Debounce search query (1 second)
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedQuery = searchQuery.trim();
      setDebouncedQuery(trimmedQuery);
      // Reset search state when query actually changes
      if (trimmedQuery !== debouncedQuery) {
        setSearchPage(1);
        setSearchResults([]);
        setHasMore(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedQuery]);

  // Search results with infinite scroll
  const [searchPage, setSearchPage] = useState(1);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [hasMore, setHasMore] = useState(false);

  const { data: searchMoviesData, isLoading: searchLoading } = useSearchMovies(debouncedQuery, searchPage);

  // Append search results when new data arrives
  useEffect(() => {
    if (searchMoviesData && debouncedQuery) {
      setSearchResults((prevResults) => {
        return searchPage === 1 ? searchMoviesData.results : [...prevResults, ...searchMoviesData.results];
      });
      setHasMore(searchPage < searchMoviesData.total_pages);
    }
  }, [searchMoviesData, debouncedQuery, searchPage]);

  // Infinite scroll with intersection observer
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadMore = useCallback(() => {
    if (!searchLoading && hasMore && debouncedQuery) {
      setSearchPage((prev) => prev + 1);
    }
  }, [searchLoading, hasMore, debouncedQuery]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || !debouncedQuery) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasMore, debouncedQuery, loadMore]);

  // Popular Movies (for TOP 10)
  const { data: popularData, isLoading: popularLoading } = usePopularMovies(1);
  const popularMovies = popularData?.results?.slice(0, 10) ?? [];

  // Backdrop slideshow state
  const [currentBackdropIndex, setCurrentBackdropIndex] = useState(0);
  const [, setIsBackdropFading] = useState(false);

  useEffect(() => {
    if (popularMovies.length === 0) return;

    const interval = setInterval(() => {
      setIsBackdropFading(true);

      setTimeout(() => {
        setCurrentBackdropIndex((prev) => (prev + 1) % popularMovies.length);
        setIsBackdropFading(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [popularMovies]);

  // Get random genres for genre carousels
  const { data: genresData } = useMovieGenres();

  const randomGenres = useMemo(() => {
    if (!genresData?.genres) return [];
    const shuffled = [...genresData.genres].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [genresData?.genres]);

  const randomGenreIds = randomGenres.map((genre) => genre.id);
  const genreMovieQueries = useMoviesByGenres(randomGenreIds);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const handleClear = () => {
    setSearchQuery('');
  };

  // Get director name from movie (mock - we'd need to fetch credits)
  const getDirectorName = (movie: Movie) => {
    // For now, return empty string as we don't fetch credits in search
    // In real implementation, you'd fetch movie credits and find director
    return movie.title;
  };

  // Get release year
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
    <div className={styles.pageContainer}>
      {/* Search Input Section */}
      <div className={styles.searchSection}>
        <div className={styles.searchInputWrapper}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={handleInputChange}
          />
          <button className={`${styles.clearButton} ${searchQuery ? styles.visible : ''}`} onClick={handleClear}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content Layout */}
      <div className={styles.contentLayout}>
        <div className={styles.contentMain}>
          {!debouncedQuery ? (
            <>
              {/* Popular TOP 10 */}
              <h2 className={styles.sectionTitle}>인기 검색어 TOP 10</h2>

              {popularLoading ? (
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
          ) : (
            <>
              {/* Search Results */}
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
                      <div className={styles.loadingSpinner} style={{ width: 24, height: 24 }} />
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
          )}
        </div>

        {/* Backdrop Slideshow (1280px+ only) */}
        {!debouncedQuery && popularMovies.length > 0 && (
          <div className={styles.backdropSection}>
            <div className={styles.backdropWrapper}>
              {popularMovies.map((movie, index) => (
                <img
                  key={movie.id}
                  src={getImageUrl(movie.backdrop_path, 'backdrop', 'w780')}
                  alt={movie.title}
                  className={`${styles.backdropImage} ${index === currentBackdropIndex ? '' : styles.fading}`}
                  style={{ display: index === currentBackdropIndex ? 'block' : 'none' }}
                />
              ))}
              <div className={styles.backdropOverlay} />
              <div className={styles.backdropIndex}>{currentBackdropIndex + 1} / 10</div>
            </div>
          </div>
        )}
      </div>

      {/* Random Genre Sections */}
      {genreMovieQueries.map(({ data: genreMovieData, isLoading: genreMovieLoading }, genreIndex) => {
        const randomGenre = randomGenres[genreIndex];
        if (!randomGenre) return null;

        const genreMovies = genreMovieData?.results ?? [];

        return (
          <div key={randomGenre.id} className={styles.genreSection}>
            <h2 className={styles.sectionTitle}>{`${randomGenre.name} 영화`}</h2>
            {genreMovieLoading && genreMovies.length === 0 ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner} />
                <span className={styles.loadingText}>로딩 중...</span>
              </div>
            ) : genreMovies.length > 0 ? (
              <div className={styles.genrePosterGrid}>
                {genreMovies.slice(0, 10).map((movie) => (
                  <Link key={movie.id} to={`/movie/${movie.id}`} className={styles.genrePosterItem}>
                    {movie.poster_path ? (
                      <img
                        src={getImageUrl(movie.poster_path, 'poster', 'w500')}
                        alt={movie.title}
                        className={styles.genrePoster}
                      />
                    ) : (
                      <div className={styles.genrePosterPlaceholder}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <rect x="2" y="2" width="20" height="20" rx="2" />
                          <path d="M12 7v10M7 12h10" />
                        </svg>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default SearchPage;
