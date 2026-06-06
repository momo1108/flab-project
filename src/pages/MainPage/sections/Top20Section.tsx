import { useNavigate } from 'react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { popularMoviesQuery } from '../../../services/tmdb/tmdbMovies';
import MovieCard from '../../../components/MovieCard/MovieCard';
import CarouselRow from '../../../components/CarouselRow/CarouselRow';
import styles from '../MainPage.module.css';
import { useMemo } from 'react';

export const Top20Section = () => {
  const navigate = useNavigate();
  const { data: popularData } = useSuspenseQuery(popularMoviesQuery(1));
  const popularMovies = useMemo(() => {
    return popularData.results.slice(0, 20);
  }, [popularData]);

  return (
    <section className={styles.section}>
      <CarouselRow title="왓챠 TOP 20" isLoading={false}>
        {popularMovies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            showRank={true}
            rank={index + 1}
            onClick={() => navigate(`/movie/${movie.id}`)}
          />
        ))}
      </CarouselRow>
    </section>
  );
};
