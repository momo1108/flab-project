import { getBackdropUrl } from '../../utils';
import type { Collection } from '../../types';
import styles from './CollectionCard.module.css';

interface CollectionCardProps {
  collection: Collection;
  onClick?: () => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onClick }) => {
  const backdropUrl = getBackdropUrl(collection.backdrop_path, 'w780');

  return (
    <div className={styles.collectionCard} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.imageWrapper}>
        <img src={backdropUrl} alt={collection.name} className={styles.image} loading="lazy" />
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
