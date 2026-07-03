import { useSuspenseQuery } from '@tanstack/react-query';
import { popularPersonsQuery } from '@/services/tmdb/queries/person';
import ArtistCard from '@/components/ArtistCard/ArtistCard';
import CarouselRow from '@/components/CarouselRow/CarouselRow';
import styles from '../MainPage.module.css';
import { configurationQueryObj } from '@/services/tmdb/queries/configuration';
import { getProfileUrl } from '@/services/tmdb/imageUrls';
import SectionWrapper from '@/components/SectionWrapper';
import { usePreloadNavigate } from '@/hooks/usePreloadNavigate';

export const ArtistsSection = () => {
  return (
    <SectionWrapper>
      <ArtistsSectionContent />
    </SectionWrapper>
  );
};

const ArtistsSectionContent = () => {
  const { getRoutingEventHandlerObject } = usePreloadNavigate();
  const { data: config } = useSuspenseQuery(configurationQueryObj);
  const {
    data: { results: popularPersons },
  } = useSuspenseQuery(popularPersonsQuery(1));

  return (
    <section className={styles.section}>
      <CarouselRow title="아티스트" description="인기 배우 및 감독" rowType="artist">
        {popularPersons.map(({ id, name, profile_path, known_for }) => (
          <ArtistCard
            key={id}
            name={name}
            profileUrl={getProfileUrl(profile_path, config, 'w185')}
            knownFor={known_for}
            {...getRoutingEventHandlerObject({ to: `/artist/${id}` })}
          />
        ))}
      </CarouselRow>
    </section>
  );
};
