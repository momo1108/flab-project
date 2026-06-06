import { useMemo } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { genresQuery } from '../../services/tmdb/tmdbGenres';
import { trendingMoviesQuery, popularMoviesQuery, moviesByGenresQuery } from '../../services/tmdb/tmdbMovies';
import { popularPersonsQuery } from '../../services/tmdb/tmdbPersons';
import { HeroSection } from './sections/HeroSection';
import { PopularMoviesSection } from './sections/PopularMoviesSection';
import { GenreSections } from './sections/GenreSections';
import { Top20Section } from './sections/Top20Section';
import { ArtistsSection } from './sections/ArtistsSection';
import styles from './MainPage.module.css';

const MainPage: React.FC = () => {
  // Data Fetching
  const { data: genresData } = useQuery(genresQuery());
  const { data: trendingData } = useQuery(trendingMoviesQuery('day'));
  const { data: popularData, isLoading: popularLoading } = useQuery(popularMoviesQuery(1));
  const { data: personsData, isLoading: personsLoading } = useQuery(popularPersonsQuery(1));

  const trendingMovies = trendingData?.results ?? [];
  const popularMovies = popularData?.results ?? [];
  const popularPersons = personsData?.results ?? [];

  // Get random genres for genre carousels
  const randomGenres = useMemo(() => {
    if (!genresData?.genres) return [];
    const shuffled = [...genresData.genres].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [genresData?.genres]);

  // Fetch movies for each random genre using useQueries
  const randomGenreIds = randomGenres.map((genre) => genre.id);
  const genreMovieQueries = useQueries({
    queries: moviesByGenresQuery(randomGenreIds, 1),
  });

  // Prepare genre sections data
  const genreSectionsData = useMemo(() => {
    return randomGenres.map((genre, index) => {
      const queryResult = genreMovieQueries[index];
      if (!queryResult) {
        return {
          genre,
          movies: [],
          isLoading: false,
        };
      }
      return {
        genre,
        movies: queryResult.data?.results ?? [],
        isLoading: queryResult.isLoading,
      };
    });
  }, [randomGenres, genreMovieQueries.length, genreMovieQueries.map((q) => q.data)]);

  return (
    <main className={styles.mainPage}>
      <HeroSection movies={trendingMovies} />
      <PopularMoviesSection movies={popularMovies} isLoading={popularLoading} />
      <GenreSections genreSections={genreSectionsData} />
      <Top20Section movies={popularMovies} isLoading={popularLoading} />
      <ArtistsSection persons={popularPersons} isLoading={personsLoading} />
    </main>
  );
};

export default MainPage;
