import { useParams } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { movieVideosQuery } from '@/services/tmdb/queries/movie';
import styles from '../../MovieDetailPage.module.css';
import SectionWrapper from '@/components/SectionWrapper';
import { Image } from '@flab/ui';

export const VideosSubsection = () => {
  const { movieId: id } = useParams({ from: '/movie/$movieId' });

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
  const { movieId: id } = useParams({ from: '/movie/$movieId' });
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
          <Image
            src={`https://img.youtube.com/vi/${key}/hqdefault.jpg`}
            alt={name}
            className={styles.videoThumbnail}
            fallbackSrc="/placeholder.png"
          />
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
