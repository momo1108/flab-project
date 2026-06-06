import { useNavigate } from 'react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { popularPersonsQuery } from '../../../services/tmdb/tmdbPersons';
import ArtistCard from '../../../components/ArtistCard/ArtistCard';
import CarouselRow from '../../../components/CarouselRow/CarouselRow';
import styles from '../MainPage.module.css';

export const ArtistsSection = () => {
  const navigate = useNavigate();
  const { data: personsData } = useSuspenseQuery(popularPersonsQuery(1));
  const popularPersons = personsData.results;

  return (
    <section className={styles.section}>
      <CarouselRow title="아티스트" description="인기 배우 및 감독" isLoading={false} rowType="artist">
        {popularPersons.map((person) => (
          <ArtistCard key={person.id} person={person} onClick={() => navigate(`/artist/${person.id}`)} />
        ))}
      </CarouselRow>
    </section>
  );
};
