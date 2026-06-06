import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useSuspenseQuery, useSuspenseQueries } from '@tanstack/react-query';
import { genresQuery } from '../../../services/tmdb/tmdbGenres';
import { moviesByGenresQuery } from '../../../services/tmdb/tmdbMovies';
import MovieCard from '../../../components/MovieCard/MovieCard';
import CarouselRow from '../../../components/CarouselRow/CarouselRow';
import styles from '../MainPage.module.css';

export const GenreSections = () => {
  const navigate = useNavigate();

  const { data: genresData } = useSuspenseQuery(genresQuery());

  // Get random genres for genre carousels
  const randomGenres = useMemo(() => {
    const shuffled = [...genresData.genres].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [genresData.genres]);

  // Fetch movies for each random genre using useSuspenseQueries
  const randomGenreIds = randomGenres.map((genre) => genre.id);
  const genreMovieQueries = useSuspenseQueries({
    queries: moviesByGenresQuery(randomGenreIds, 1),
  });

  if (randomGenres.length === 0) return null;

  return (
    <>
      {genreMovieQueries.map(({ data: genreMovieData }, genreIndex) => {
        const randomGenre = randomGenres[genreIndex]!;
        const genreMovies = genreMovieData.results;

        return (
          <section key={randomGenre.id} className={styles.section}>
            <CarouselRow
              title={`${randomGenre.name} 영화`}
              description={`${randomGenre.name} 장르의 인기 영화들`}
              isLoading={false}
            >
              {genreMovies.slice(0, 10).map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={() => navigate(`/movie/${movie.id}`)} />
              ))}
            </CarouselRow>
          </section>
        );
      })}
    </>
  );
};
