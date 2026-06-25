import { useParams } from 'react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { movieVideosQuery } from '@/services/tmdb/queries/movie';
import styles from '../../MovieDetailPage.module.css';
import SectionWrapper from '@/components/SectionWrapper';

export const VideosSubsection = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className={styles.subsection}>
      <h2 className={styles.sectionTitle}>관련 동영상</h2>
      <SectionWrapper resetKeys={[id]}>
        <VideosSubsectionContent />
      </SectionWrapper>
    </div>
  );
};

const VideosSubsectionContent = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id ? Number.parseInt(id, 10) : 0;

  const {
    data: { youtubeVideos },
  } = useSuspenseQuery(movieVideosQuery(movieId));

  if (youtubeVideos.length === 0) return null;

  return (
    <div className={styles.videosGrid}>
      {youtubeVideos.map(({ id, key, name }) => (
        <a
          key={id}
          href={`https://www.youtube.com/watch?v=${key}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.videoCard}
        >
          <img src={`https://img.youtube.com/vi/${key}/hqdefault.jpg`} alt={name} className={styles.videoThumbnail} />
          <div className={styles.playOverlay}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 11 8 5 13 5 3" />
            </svg>
          </div>
          <div className={styles.videoName}>{name}</div>
        </a>
      ))}
    </div>
  );
};
