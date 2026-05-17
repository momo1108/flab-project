import { Link } from 'react-router';
import type { Genre, MovieResponse } from '../../types/tmdb';
import { getImageUrl } from '../../utils/image';
import styles from './SearchPage.module.css';
import type { UseQueryResult } from '@tanstack/react-query';

export type GenreMovieQuery = UseQueryResult<MovieResponse, Error>;

interface GenreSectionsProps {
  randomGenres: Genre[];
  genreMovieQueries: GenreMovieQuery[];
  posterColumnCount: number;
}

export const GenreSections: React.FC<GenreSectionsProps> = ({ randomGenres, genreMovieQueries, posterColumnCount }) => {
  return (
    <>
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
                {genreMovies.slice(0, posterColumnCount).map((movie) => (
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
    </>
  );
};
