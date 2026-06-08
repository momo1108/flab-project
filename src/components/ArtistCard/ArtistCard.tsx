import { useImageUrls } from '@/hooks/useImageUrls';
import type { Person } from '@/types/tmdb';
import styles from './ArtistCard.module.css';

interface ArtistCardProps {
  person: Person;
  onClick?: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ person, onClick }) => {
  const { getProfileUrl } = useImageUrls();
  const profileUrl = getProfileUrl(person.profile_path, 'w185');

  return (
    <div className={styles.artistCard} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.imageWrapper}>
        <img src={profileUrl} alt={person.name} className={styles.image} loading="lazy" />
        {!person.profile_path && (
          <div className={styles.placeholder}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            </svg>
          </div>
        )}
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{person.name}</h3>
        {person.known_for.length && <p className={styles.latestMovie}>{person.known_for[0]!.title}</p>}
      </div>
    </div>
  );
};

export default ArtistCard;
