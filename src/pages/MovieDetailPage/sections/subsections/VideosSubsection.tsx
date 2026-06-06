import { useParams } from 'react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { movieVideosQuery } from '../../../../services/tmdb/tmdbMovies';
import styles from '../../MovieDetailPage.module.css';
import { useMemo } from 'react';

export const VideosSubsection = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id ? Number.parseInt(id, 10) : 0;

  const { data: videosData } = useSuspenseQuery(movieVideosQuery(movieId));
  const youtubeVideos = useMemo(() => {
    return videosData.results.filter((v) => v.site === 'YouTube').slice(0, 4);
  }, [videosData]);

  if (youtubeVideos.length === 0) return null;

  return (
    <div className={styles.videosGrid}>
      {youtubeVideos.map((video) => (
        <a
          key={video.id}
          href={`https://www.youtube.com/watch?v=${video.key}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.videoCard}
        >
          <img
            src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
            alt={video.name}
            className={styles.videoThumbnail}
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
          <div className={styles.videoName}>{video.name}</div>
        </a>
      ))}
    </div>
  );
};
