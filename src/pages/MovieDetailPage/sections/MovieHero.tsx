import { useMemo } from 'react';
import { useParams } from 'react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { movieDetailQuery, movieImagesQuery } from '@/services/tmdb/queries/movieQueries';
import { useImageUrls } from '@/hooks/useImageUrls';
import styles from '../MovieDetailPage.module.css';

const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
};

const formatVoteCount = (count: number): string => new Intl.NumberFormat('ko-KR').format(count);

export const MovieHero = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id ? Number.parseInt(id, 10) : 0;

  const { data: movie } = useSuspenseQuery(movieDetailQuery(movieId));
  const { data: images } = useSuspenseQuery(movieImagesQuery(movieId));

  const { getImageUrl, getBackdropUrl } = useImageUrls();
  const logo = images?.logos?.[0];
  const releaseYear = useMemo(() => movie.release_date?.split('-')[0] ?? '', [movie.release_date]);

  return (
    <div className={styles.hero}>
      <section className={styles.movieInfoSection}>
        {logo && (
          <img
            src={getImageUrl(logo.file_path, 'poster', 'w500')}
            alt={`${movie.title} 로고`}
            className={styles.logo}
          />
        )}
        <h1 className={styles.movieTitle}>{movie.title}</h1>
        <div className={styles.movieInfoBar}>
          <span>{releaseYear}</span>
          <span>{formatRuntime(movie.runtime)}</span>
          {movie.genres?.map((g) => (
            <span key={g.id}>{g.name}</span>
          ))}
        </div>
        <div className={styles.overviewContainer}>
          <p className={styles.overview}>{movie.overview || '줄거리 정보가 없습니다.'}</p>
        </div>
        <div className={styles.statsList}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{movie.vote_average.toFixed(1)}</span>
            <span className={styles.statLabel}>평점</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{formatVoteCount(movie.vote_count)}</span>
            <span className={styles.statLabel}>평가</span>
          </div>
        </div>
        <div className={styles.statsListCompact}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{movie.vote_average.toFixed(1)}</span>
            <span className={styles.statLabel}>평점</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{formatVoteCount(movie.vote_count)}</span>
            <span className={styles.statLabel}>평가</span>
          </div>
        </div>
        <button className={styles.watchButton}>감상하기</button>
      </section>

      <section className={styles.backdropSection}>
        <div className={styles.backdropOverlay} />
        {movie.backdrop_path && (
          <img
            src={getBackdropUrl(movie.backdrop_path, 'w1280')}
            alt={`${movie.title} 배경`}
            className={styles.backdropImage}
          />
        )}
        <div className={styles.backdropStats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{movie.vote_average.toFixed(1)}</span>
            <span className={styles.statLabel}>평점</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{formatVoteCount(movie.vote_count)}</span>
            <span className={styles.statLabel}>평가</span>
          </div>
        </div>
      </section>
    </div>
  );
};
