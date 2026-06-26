import Image from '../Image';
import styles from './ArtistCard.module.css';

interface ArtistCardProps {
  name: string;
  profileUrl: string;
  knownFor: Array<{ title: string }>;
  onClick?: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ name, profileUrl, knownFor, onClick }) => {
  return (
    <div className={styles.artistCard} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.imageWrapper}>
        {profileUrl ? (
          <Image
            src={profileUrl}
            alt={name}
            className={styles.image}
            fallbackSrc="/default-avatar.png"
            loading="lazy"
          />
        ) : (
          <div className={styles.placeholder}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            </svg>
          </div>
        )}
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        {knownFor.length && <p className={styles.latestMovie}>{knownFor[0]!.title}</p>}
      </div>
    </div>
  );
};

export default ArtistCard;
