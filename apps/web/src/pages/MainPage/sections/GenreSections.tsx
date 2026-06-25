import { useNavigate } from 'react-router';
import { useSuspenseQuery, useSuspenseQueries } from '@tanstack/react-query';
import { moviesByGenresQuery } from '@/services/tmdb/queries/movies';
import MovieCard from '@/components/MovieCard/MovieCard';
import CarouselRow from '@/components/CarouselRow/CarouselRow';
import styles from '../MainPage.module.css';
import { configurationQueryObj } from '@/services/tmdb/queries/configuration';
import { getPosterUrl } from '@/services/tmdb/imageUrls';
import { genresQueryObj } from '@/services/tmdb/queries/genre';
import SectionWrapper from '@/components/SectionWrapper';
import type { Genre } from '@/types/tmdb';
import { shuffleArray } from '@/utils/random';

export const GenreSections = () => {
  return (
    <SectionWrapper>
      <GenreSectionsContent />
    </SectionWrapper>
  );
};

const GenreSectionsContent = () => {
  const navigate = useNavigate();

  const { data: config } = useSuspenseQuery(configurationQueryObj);
  const {
    data: { genres: genresData },
  } = useSuspenseQuery(genresQueryObj);

  // Get random genres for genre carousels
  const randomGenres = shuffleArray<Genre>(genresData).slice(0, 3);

  // Fetch movies for each random genre using useSuspenseQueries
  const randomGenreIds = randomGenres.map((genre) => genre.id);
  const genreMovieQueries = useSuspenseQueries({
    queries: moviesByGenresQuery(randomGenreIds, 1, 16),
  });

  if (randomGenres.length === 0) return null;

  return genreMovieQueries.map(({ data: { results: genreMovies } }, genreIndex) => {
    const randomGenre = randomGenres[genreIndex]!;

    return (
      <section key={randomGenre.id} className={styles.section}>
        <CarouselRow title={`${randomGenre.name} 영화`} description={`${randomGenre.name} 장르의 인기 영화들`}>
          {genreMovies.map(({ id, title, poster_path, vote_average, release_date }) => (
            <MovieCard
              key={id}
              title={title}
              posterUrl={getPosterUrl(poster_path, config)}
              voteAverage={vote_average}
              releaseDate={release_date}
              onClick={() => navigate(`/movie/${id}`)}
            />
          ))}
        </CarouselRow>
      </section>
    );
  });
};
