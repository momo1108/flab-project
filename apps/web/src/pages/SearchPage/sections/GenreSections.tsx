import { useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { moviesByGenresQuery } from '@/services/tmdb/queries/movies';
import styles from '../SearchPage.module.css';
import SectionWrapper from '@/components/SectionWrapper';
import { getPosterUrl } from '@/services/tmdb/imageUrls';
import { configurationQueryObj } from '@/services/tmdb/queries/configuration';
import { genresQueryObj } from '@/services/tmdb/queries/genre';
import { shuffleArray } from '@/utils/random';
import type { Genre } from '@/types/tmdb';
import Image from '@/components/Image';

export const GenreSections: React.FC = () => {
  return (
    <SectionWrapper>
      <GenreSectionsContent />
    </SectionWrapper>
  );
};

const GenreSectionsContent: React.FC = () => {
  const { data: config } = useSuspenseQuery(configurationQueryObj);
  const {
    data: { genres: genresData },
  } = useSuspenseQuery(genresQueryObj);

  const randomGenres = shuffleArray<Genre>(genresData).slice(0, 3);

  // Fetch movies for each random genre using useSuspenseQueries
  const randomGenreIds = randomGenres.map((genre) => genre.id);
  const genreMovieQueries = useSuspenseQueries({
    queries: moviesByGenresQuery(randomGenreIds, 1, 8),
  });

  return genreMovieQueries.map(({ data: { results: genreMovies } }, genreIndex) => {
    const { id, name } = randomGenres[genreIndex]!;

    return (
      <div key={id} className={styles.genreSection}>
        <h2 className={styles.sectionTitle}>{`${name} 영화`}</h2>
        <div className={styles.genrePosterGrid}>
          {genreMovies.map(({ id, poster_path, title }) => (
            <Link key={id} to={`/movie/${id}`} className={styles.genrePosterItem}>
              {poster_path ? (
                <Image
                  src={getPosterUrl(poster_path, config, 'w500')}
                  alt={title}
                  className={styles.genrePoster}
                  fallbackSrc="/placeholder.png"
                  loading="lazy"
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
      </div>
    );
  });
};
