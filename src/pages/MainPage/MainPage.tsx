import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useQuery, useQueries } from '@tanstack/react-query';
import { genresQuery } from '../../services/tmdb/tmdbGenres';
import { trendingMoviesQuery, popularMoviesQuery, moviesByGenresQuery } from '../../services/tmdb/tmdbMovies';
import { popularPersonsQuery } from '../../services/tmdb/tmdbPersons';
import MovieCard from '../../components/MovieCard/MovieCard';
import ArtistCard from '../../components/ArtistCard/ArtistCard';
import CarouselRow from '../../components/CarouselRow/CarouselRow';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import styles from './MainPage.module.css';

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: genresData } = useQuery(genresQuery());

  // Trending Movies (for Hero Carousel)
  const { data: trendingData } = useQuery(trendingMoviesQuery('day'));

  // Popular Movies (for various sections)
  const { data: popularData, isLoading: popularLoading } = useQuery(popularMoviesQuery(1));

  // Popular Persons (for Artist section)
  const { data: personsData, isLoading: personsLoading } = useQuery(popularPersonsQuery(1));

  // Get random genres for genre carousels
  const randomGenres = useMemo(() => {
    if (!genresData?.genres) return [];
    const shuffled = [...genresData.genres].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [genresData?.genres]);

  const trendingMovies = trendingData?.results ?? [];
  const popularMovies = popularData?.results ?? [];
  const popularPersons = personsData?.results ?? [];

  // Fetch movies for each random genre using useQueries
  const randomGenreIds = randomGenres.map((genre) => genre.id);
  const genreMovieQueries = useQueries({
    queries: moviesByGenresQuery(randomGenreIds, 1),
  });

  return (
    <main className={styles.mainPage}>
      {/* Hero Carousel */}
      <section className={styles.heroSection}>
        {trendingMovies.length > 0 ? (
          <HeroCarousel movies={trendingMovies.slice(0, 10)} />
        ) : (
          <div className={styles.heroSkeleton} />
        )}
      </section>

      {/* Popular Movies Section */}
      <section className={styles.section}>
        <CarouselRow title="지금 뜨는 영화" isLoading={popularLoading}>
          {popularMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={() => navigate(`/movie/${movie.id}`)} />
          ))}
        </CarouselRow>
      </section>

      {/* Genre-based Sections */}
      {genreMovieQueries.map(({ data: genreMovieData, isLoading: genreMovieLoading }, genreIndex) => {
        const randomGenre = randomGenres[genreIndex]!;
        const genreMovies = genreMovieData?.results ?? [];

        return (
          <section key={randomGenre.id} className={styles.section}>
            <CarouselRow
              title={`${randomGenre.name} 영화`}
              description={`${randomGenre.name} 장르의 인기 영화들`}
              isLoading={genreMovieLoading}
            >
              {genreMovies.slice(0, 10).map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={() => navigate(`/movie/${movie.id}`)} />
              ))}
            </CarouselRow>
          </section>
        );
      })}

      {/* TOP 20 Section */}
      <section className={styles.section}>
        <CarouselRow title="왓챠 TOP 20" isLoading={popularLoading}>
          {popularMovies.slice(0, 20).map((movie, index) => (
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

      {/* Artists Section */}
      <section className={styles.section}>
        <CarouselRow title="아티스트" description="인기 배우 및 감독" isLoading={personsLoading} rowType="artist">
          {popularPersons.map((person) => (
            <ArtistCard key={person.id} person={person} onClick={() => navigate(`/artist/${person.id}`)} />
          ))}
        </CarouselRow>
      </section>
    </main>
  );
};

export default MainPage;
