import { useNavigate } from 'react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { popularMoviesQuery } from '@/services/tmdb/queries/moviesQueries';
import MovieCard from '@/components/MovieCard/MovieCard';
import CarouselRow from '@/components/CarouselRow/CarouselRow';
import styles from '../MainPage.module.css';

export const PopularMoviesSection = () => {
  const navigate = useNavigate();
  const { data: popularData } = useSuspenseQuery(popularMoviesQuery(1));
  const popularMovies = popularData.results;

  return (
    <section className={styles.section}>
      <CarouselRow title="지금 뜨는 영화" isLoading={false}>
        {popularMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={() => navigate(`/movie/${movie.id}`)} />
        ))}
      </CarouselRow>
    </section>
  );
};
