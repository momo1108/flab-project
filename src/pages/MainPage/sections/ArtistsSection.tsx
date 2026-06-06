import { useNavigate } from 'react-router';
import ArtistCard from '../../../components/ArtistCard/ArtistCard';
import CarouselRow from '../../../components/CarouselRow/CarouselRow';
import styles from '../MainPage.module.css';
import type { Person } from '../../../types/tmdb';

interface ArtistsSectionProps {
  persons: Person[];
  isLoading: boolean;
}

export const ArtistsSection = ({ persons, isLoading }: ArtistsSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className={styles.section}>
      <CarouselRow title="아티스트" description="인기 배우 및 감독" isLoading={isLoading} rowType="artist">
        {persons.map((person) => (
          <ArtistCard key={person.id} person={person} onClick={() => navigate(`/artist/${person.id}`)} />
        ))}
      </CarouselRow>
    </section>
  );
};
