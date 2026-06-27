import { useNavigate } from 'react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { popularMoviesQuery } from '@/services/tmdb/queries/movies';
import { MovieCard } from '@flab/ui';
import CarouselRow from '@/components/CarouselRow/CarouselRow';
import styles from '../MainPage.module.css';
import { getPosterUrl } from '@/services/tmdb/imageUrls';
import { configurationQueryObj } from '@/services/tmdb/queries/configuration';
import SectionWrapper from '@/components/SectionWrapper';

export const PopularMoviesSection = () => {
  return (
    <SectionWrapper>
      <PopularMoviesSectionContent />
    </SectionWrapper>
  );
};

const PopularMoviesSectionContent = () => {
  const navigate = useNavigate();
  const { data: config } = useSuspenseQuery(configurationQueryObj);
  const {
    data: { results: popularMovies },
  } = useSuspenseQuery(popularMoviesQuery(1));

  return (
    <section className={styles.section}>
      <CarouselRow title="지금 뜨는 영화">
        {popularMovies.map(({ id, title, poster_path, vote_average, release_date }) => (
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
};
