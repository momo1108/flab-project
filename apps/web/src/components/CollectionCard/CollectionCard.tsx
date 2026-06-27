import type { Collection } from '@/types/tmdb';
import styles from './CollectionCard.module.css';
import { Image } from '@flab/ui';

interface CollectionCardProps {
  collection: Collection;
  backdropUrl: string;
  onClick?: () => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, backdropUrl, onClick }) => {
  return (
    <div className={styles.collectionCard} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.imageWrapper}>
        <Image
          src={backdropUrl}
          alt={collection.name}
          className={styles.image}
          fallbackSrc="/placeholder.png"
          loading="lazy"
        />
        <div className={styles.overlay}>
          <div className={styles.content}>
            <h3 className={styles.name}>{collection.name}</h3>
            {collection.overview && <p className={styles.overview}>{collection.overview}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
