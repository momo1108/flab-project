import { useSuspenseQuery } from '@tanstack/react-query';
import { popularMoviesQuery } from '@/services/tmdb/queries/movies';
import CarouselRow from '@/components/CarouselRow/CarouselRow';
import styles from '../MainPage.module.css';
import { configurationQueryObj } from '@/services/tmdb/queries/configuration';
import { getPosterUrl } from '@/services/tmdb/imageUrls';
import SectionWrapper from '@/components/SectionWrapper';
import { MovieCard } from '@flab/ui';
import { usePreloadNavigate } from '@/hooks/usePreloadNavigate';

export const Top20Section = () => {
  return (
    <SectionWrapper>
      <Top20SectionContent />
    </SectionWrapper>
  );
};

const Top20SectionContent = () => {
  const { getRoutingEventHandlerObject } = usePreloadNavigate();
  const { data: config } = useSuspenseQuery(configurationQueryObj);
  const {
    data: { results: popularMovies },
  } = useSuspenseQuery(popularMoviesQuery(1, 20));

  return (
    <section className={styles.section}>
      <CarouselRow title="왓챠 TOP 20">
        {popularMovies.map(({ id, title, poster_path, vote_average, release_date }, index) => (
          <MovieCard
            key={id}
            title={title}
            posterUrl={getPosterUrl(poster_path, config)}
            voteAverage={vote_average}
            releaseDate={release_date}
            rank={index + 1}
            {...getRoutingEventHandlerObject({ to: `/movie/${id}` })}
          />
        ))}
      </CarouselRow>
    </section>
  );
};
