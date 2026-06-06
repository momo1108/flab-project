import { useNavigate } from 'react-router';
import MovieCard from '../../../components/MovieCard/MovieCard';
import CarouselRow from '../../../components/CarouselRow/CarouselRow';
import styles from '../MainPage.module.css';
import type { Movie, Genre } from '../../../types/tmdb';

interface GenreSectionData {
  genre: Genre;
  movies: Movie[];
  isLoading: boolean;
}

interface GenreSectionsProps {
  genreSections: GenreSectionData[];
}

export const GenreSections = ({ genreSections }: GenreSectionsProps) => {
  const navigate = useNavigate();

  if (genreSections.length === 0) return null;

  return (
    <>
      {genreSections.map(({ genre, movies, isLoading }) => (
        <section key={genre.id} className={styles.section}>
          <CarouselRow
            title={`${genre.name} 영화`}
            description={`${genre.name} 장르의 인기 영화들`}
            isLoading={isLoading}
          >
            {movies.slice(0, 10).map((movie) => (
              <MovieCard key={movie.id} movie={movie} onClick={() => navigate(`/movie/${movie.id}`)} />
            ))}
          </CarouselRow>
        </section>
      ))}
    </>
  );
};
