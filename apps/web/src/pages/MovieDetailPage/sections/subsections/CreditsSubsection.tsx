import { useParams } from 'react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { movieCreditsQuery } from '@/services/tmdb/queries/movieQueries';
import styles from '../../MovieDetailPage.module.css';
import type { CastMember } from '@/types/tmdb';
import { configurationQueryObj } from '@/services/tmdb/queries/configurationQueries';
import { getProfileUrl } from '@/services/tmdb/imageUrls';
import SectionWrapper from '@/components/SectionWrapper';

export const CreditsSubsection = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className={styles.subsection}>
      <h2 className={styles.sectionTitle}>감독/출연</h2>
      <SectionWrapper resetKeys={[id]}>
        <CreditsSubsectionContent />
      </SectionWrapper>
    </div>
  );
};

const CreditsSubsectionContent = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id ? Number.parseInt(id, 10) : 0;

  const { data: config } = useSuspenseQuery(configurationQueryObj);
  const {
    data: { producer, top10Cast },
  } = useSuspenseQuery(movieCreditsQuery(movieId));

  if (!producer && top10Cast.length === 0) {
    return <p className={styles.emptyState}>감독/배우 정보가 없습니다.</p>;
  }

  return (
    <div className={styles.castGrid}>
      {producer && (
        <div className={styles.castCard}>
          <img
            src={getProfileUrl(producer.profile_path, config, 'w185')}
            onError={(e) => {
              e.currentTarget.src = '/default-avatar.png';
            }}
            alt={producer.name}
            className={styles.castProfileImage}
          />
          <div className={styles.castInfo}>
            <span className={styles.castName}>{producer.name}</span>
            <span className={styles.castRole}>감독</span>
          </div>
        </div>
      )}
      {top10Cast.map(({ id, profile_path, name, character }: CastMember) => (
        <div key={id} className={styles.castCard}>
          <img
            src={getProfileUrl(profile_path, config, 'w185')}
            onError={(e) => {
              e.currentTarget.src = '/default-avatar.png';
            }}
            alt={name}
            className={styles.castProfileImage}
          />
          <div className={styles.castInfo}>
            <span className={styles.castName}>{name}</span>
            <span className={styles.castRole}>배우 {character}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
