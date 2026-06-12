import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useSuspenseQuery, useSuspenseQueries } from '@tanstack/react-query';
import { moviesByGenresQuery } from '@/services/tmdb/queries/moviesQueries';
import MovieCard from '@/components/MovieCard/MovieCard';
import CarouselRow from '@/components/CarouselRow/CarouselRow';
import styles from '../MainPage.module.css';
import { configurationQueryObj } from '@/services/tmdb/queries/configurationQueries';
import { getPosterUrl } from '@/services/tmdb/imageUrls';
import { genresQueryObj } from '@/services/tmdb/queries/genreQueries';
import SectionWrapper from '@/components/SectionWrapper';

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
  const randomGenres = useMemo(() => {
    const shuffled = [...genresData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [genresData]);

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
