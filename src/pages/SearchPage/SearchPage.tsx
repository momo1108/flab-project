import { useState, useEffect, useRef, useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { tmdbClient } from '../../services/tmdbClient';
import {
  useTMDBConfiguration,
  usePopularMovies,
  useSearchMovies,
  useMoviesByGenres,
  useMovieGenres,
} from '../../hooks/useTMDB';
import { setImageConfig } from '../../utils/image';
import styles from './SearchPage.module.css';
import type { Movie, MovieCreditsResponse } from '../../types/tmdb';
import { SearchInputSection } from './SearchInputSection';
import { PopularTop10 } from './PopularTop10';
import { SearchResults } from './SearchResults';
import { BackdropSlideshow } from './BackdropSlideshow';
import { GenreSections } from './GenreSections';

const getPosterColumnCount = (): number => {
  if (typeof window === 'undefined') return 8;
  return parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--poster-column-count').trim() || '3',
    10,
  );
};

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

  // Debounce search query (1 second)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search results with infinite scroll using useInfiniteQuery
  const {
    data: searchMoviesData,
    isLoading: searchLoading,
    hasNextPage: hasMore,
    fetchNextPage,
    isFetchingNextPage,
  } = useSearchMovies(debouncedQuery);

  const searchResults = searchMoviesData?.pages?.reduce<Movie[]>((acc, page) => [...acc, ...page.results], []) ?? [];

  // Infinite scroll with intersection observer
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || !debouncedQuery) return;

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
  }, [hasMore, debouncedQuery, fetchNextPage, isFetchingNextPage]);

  // Popular Movies (for TOP 10)
  const { data: popularData, isLoading: popularLoading } = usePopularMovies(1);
  const popularMovies = popularData?.results?.slice(0, 10) ?? [];

  // Get random genres for genre carousels
  const { data: genresData } = useMovieGenres();

  const randomGenres = useMemo(() => {
    if (!genresData?.genres) return [];
    const shuffled = [...genresData.genres].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [genresData?.genres]);

  // Get poster column count from CSS variable with resize listener
  const [posterColumnCount, setPosterColumnCount] = useState(() => getPosterColumnCount());

  useEffect(() => {
    const handleResize = () => {
      setPosterColumnCount(getPosterColumnCount());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const randomGenreIds = randomGenres.map((genre) => genre.id);
  const genreMovieQueries = useMoviesByGenres(randomGenreIds);

  // Fetch credits for search result movies to get director names
  const movieCreditsQueries = useQueries({
    queries: searchResults.map((movie) => ({
      queryKey: ['movieCredits', movie.id],
      queryFn: () => tmdbClient.getMovieCredits(movie.id),
      enabled: !!movie.id,
      staleTime: 1000 * 60 * 10,
    })),
  });

  const creditsData = movieCreditsQueries.map((q) => q.data) as MovieCreditsResponse[];

  // Director name cache for quick lookup
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

  const getDirectorName = (movie: Movie) => {
    return directorNameCache.get(movie.id) ?? '';
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Search Input Section */}
      <SearchInputSection searchQuery={searchQuery} onInputChange={handleInputChange} onClear={handleClear} />

      {/* Content Layout */}
      <div className={styles.contentLayout}>
        <div className={styles.contentMain}>
          {!debouncedQuery ? (
            <PopularTop10 popularMovies={popularMovies} isLoading={popularLoading} />
          ) : (
            <SearchResults
              searchResults={searchResults}
              searchLoading={searchLoading}
              hasMore={hasMore}
              loadMoreRef={loadMoreRef}
              getDirectorName={getDirectorName}
              isFetchingNextPage={isFetchingNextPage}
            />
          )}
        </div>

        {/* Backdrop Slideshow (1280px+ only) */}
        {!debouncedQuery && popularMovies.length > 0 && <BackdropSlideshow popularMovies={popularMovies} />}
      </div>

      {/* Random Genre Sections */}
      <GenreSections
        randomGenres={randomGenres}
        genreMovieQueries={genreMovieQueries}
        posterColumnCount={posterColumnCount}
      />
    </div>
  );
};

export default SearchPage;
