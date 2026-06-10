import { useEffect, useMemo, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { moviesByGenreQuery } from '@/services/tmdb/queries/moviesQueries';
import styles from '../SearchPage.module.css';
import SectionWrapper from '@/components/SectionWrapper';
import { getPosterUrl } from '@/services/tmdb/imageUrls';
import { configurationQueryObj } from '@/services/tmdb/queries/configurationQueries';
import { genresQueryObj } from '@/services/tmdb/queries/genreQueries';

const getPosterColumnCount = (): number => {
  if (typeof window === 'undefined') return 8;
  return parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--poster-column-count').trim() || '3',
    10,
  );
};

interface GenreMovieGridProps {
  genreId: number;
  posterColumnCount: number;
}

const GenreMovieGrid: React.FC<GenreMovieGridProps> = ({ genreId, posterColumnCount }) => {
  const { data: config } = useSuspenseQuery(configurationQueryObj);
  const { data } = useSuspenseQuery(moviesByGenreQuery(genreId, 1));
  const genreMovies = useMemo(() => {
    return data.results.slice(0, posterColumnCount);
  }, [data, posterColumnCount]);

  if (genreMovies.length === 0) return null;

  return (
    <div className={styles.genrePosterGrid}>
      {genreMovies.map(({ id, poster_path, title }) => (
        <Link key={id} to={`/movie/${id}`} className={styles.genrePosterItem}>
          {poster_path ? (
            <img src={getPosterUrl(poster_path, config, 'w500')} alt={title} className={styles.genrePoster} />
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
  );
};

export const GenreSections: React.FC = () => {
  const { data: genresData } = useSuspenseQuery(genresQueryObj);

  const randomGenres = useMemo(() => {
    if (!genresData?.genres) return [];
    const shuffled = [...genresData.genres].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [genresData?.genres]);

  const [posterColumnCount, setPosterColumnCount] = useState(() => getPosterColumnCount());

  useEffect(() => {
    const handleResize = () => {
      setPosterColumnCount(getPosterColumnCount());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return randomGenres.map(({ id, name }) => {
    return (
      <div key={id} className={styles.genreSection}>
        <h2 className={styles.sectionTitle}>{`${name} 영화`}</h2>
        <SectionWrapper resetKeys={[id]}>
          <GenreMovieGrid genreId={id} posterColumnCount={posterColumnCount} />
        </SectionWrapper>
      </div>
    );
  });
};
