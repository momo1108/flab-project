import { useNavigate } from 'react-router';
import MovieCard from '../../../components/MovieCard/MovieCard';
import CarouselRow from '../../../components/CarouselRow/CarouselRow';
import styles from '../MainPage.module.css';
import type { Movie } from '../../../types/tmdb';

interface Top20SectionProps {
  movies: Movie[];
  isLoading: boolean;
}

export const Top20Section = ({ movies, isLoading }: Top20SectionProps) => {
  const navigate = useNavigate();

  return (
    <section className={styles.section}>
      <CarouselRow title="왓챠 TOP 20" isLoading={isLoading}>
        {movies.slice(0, 20).map((movie, index) => (
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
