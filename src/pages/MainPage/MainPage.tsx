import { useEffect, useMemo } from 'react';
import {
  useTMDBConfiguration,
  useMovieGenres,
  useTrendingMovies,
  usePopularMovies,
  usePopularPersons,
  useMoviesByGenres,
} from '../../hooks';
import { setImageConfig } from '../../utils';
import { Header, Footer, MovieCard, ArtistCard, CarouselRow, HeroCarousel } from '../../components';
import styles from './MainPage.module.css';

const MainPage: React.FC = () => {
  console.log(styles);

  // API Configuration
  const { data: config } = useTMDBConfiguration();
  const { data: genresData } = useMovieGenres();

  // Initialize image config
  useEffect(() => {
    if (config?.images) {
      setImageConfig(config.images);
    }
  }, [config]);

  // Trending Movies (for Hero Carousel)
  const { data: trendingData } = useTrendingMovies('day');

  // Popular Movies (for various sections)
  const { data: popularData, isLoading: popularLoading } = usePopularMovies(1);

  // Popular Persons (for Artist section)
  const { data: personsData, isLoading: personsLoading } = usePopularPersons(1);

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
  const genreMovieQueries = useMoviesByGenres(randomGenreIds);

  return (
    <div className={styles.mainPage}>
      <Header />

      <main className={styles.mainContent}>
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
              <MovieCard key={movie.id} movie={movie} />
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
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </CarouselRow>
            </section>
          );
        })}

        {/* TOP 20 Section */}
        <section className={styles.section}>
          <CarouselRow title="왓챠 TOP 20" isLoading={popularLoading}>
            {popularMovies.slice(0, 20).map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} showRank={true} rank={index + 1} />
            ))}
          </CarouselRow>
        </section>

        {/* Artists Section */}
        <section className={styles.section}>
          <CarouselRow title="아티스트" description="인기 배우 및 감독" isLoading={personsLoading} rowType="artist">
            {popularPersons.map((person) => (
              <ArtistCard key={person.id} person={person} />
            ))}
          </CarouselRow>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MainPage;
