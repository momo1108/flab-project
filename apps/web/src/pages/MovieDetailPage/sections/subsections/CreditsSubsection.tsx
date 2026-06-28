import { useParams } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { movieCreditsQuery } from '@/services/tmdb/queries/movie';
import styles from '../../MovieDetailPage.module.css';
import type { CastMember } from '@/types/tmdb';
import { configurationQueryObj } from '@/services/tmdb/queries/configuration';
import { getProfileUrl } from '@/services/tmdb/imageUrls';
import SectionWrapper from '@/components/SectionWrapper';
import { Image } from '@flab/ui';

export const CreditsSubsection = () => {
  const { movieId: id } = useParams({ from: '/movie/$movieId' });

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
  const { movieId: id } = useParams({ from: '/movie/$movieId' });
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
          <Image
            src={getProfileUrl(producer.profile_path, config, 'w185')}
            alt={producer.name}
            className={styles.castProfileImage}
            fallbackSrc="/default-avatar.png"
          />
          <div className={styles.castInfo}>
            <span className={styles.castName}>{producer.name}</span>
            <span className={styles.castRole}>감독</span>
          </div>
        </div>
      )}
      {top10Cast.map(({ id, profile_path, name, character }: CastMember) => (
        <div key={id} className={styles.castCard}>
          <Image
            src={getProfileUrl(profile_path, config, 'w185')}
            alt={name}
            className={styles.castProfileImage}
            fallbackSrc="/default-avatar.png"
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
