import { useNavigate } from 'react-router';
import MovieCard from '../../../components/MovieCard/MovieCard';
import CarouselRow from '../../../components/CarouselRow/CarouselRow';
import styles from '../MainPage.module.css';
import type { Movie } from '../../../types/tmdb';

interface PopularMoviesSectionProps {
  movies: Movie[];
  isLoading: boolean;
}

export const PopularMoviesSection = ({ movies, isLoading }: PopularMoviesSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className={styles.section}>
      <CarouselRow title="지금 뜨는 영화" isLoading={isLoading}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={() => navigate(`/movie/${movie.id}`)} />
        ))}
      </CarouselRow>
    </section>
  );
};
