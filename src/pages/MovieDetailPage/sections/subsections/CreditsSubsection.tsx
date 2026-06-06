import { useParams } from 'react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { movieCreditsQuery } from '../../../../services/tmdb/tmdbMovies';
import { useImageUrls } from '../../../../hooks/useImageUrls';
import styles from '../../MovieDetailPage.module.css';
import type { CastMember, CrewMember } from '../../../../types/tmdb';

export const CreditsSubsection = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id ? Number.parseInt(id, 10) : 0;

  const { data: credits } = useSuspenseQuery(movieCreditsQuery(movieId));
  const { getProfileUrl } = useImageUrls();

  const producer: CrewMember | undefined =
    credits.crew.find((c) => c.job === 'Executive Producer') ?? credits.crew.find((c) => c.job === 'Producer');

  const topCast = credits.cast.sort((a, b) => a.order - b.order).slice(0, 10);

  if (!producer && topCast.length === 0) {
    return <p className={styles.emptyState}>감독/배우 정보가 없습니다.</p>;
  }

  return (
    <div className={styles.castGrid}>
      {producer && (
        <div className={styles.castCard}>
          <img
            src={getProfileUrl(producer.profile_path, 'w185')}
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
      {topCast.map((person: CastMember) => (
        <div key={person.id} className={styles.castCard}>
          <img
            src={getProfileUrl(person.profile_path, 'w185')}
            onError={(e) => {
              e.currentTarget.src = '/default-avatar.png';
            }}
            alt={person.name}
            className={styles.castProfileImage}
          />
          <div className={styles.castInfo}>
            <span className={styles.castName}>{person.name}</span>
            <span className={styles.castRole}>배우 {person.character}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
