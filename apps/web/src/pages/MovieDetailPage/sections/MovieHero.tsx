import { useParams } from 'react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { movieDetailQuery, movieImagesQuery } from '@/services/tmdb/queries/movie';
import styles from '../MovieDetailPage.module.css';
import { configurationQueryObj } from '@/services/tmdb/queries/configuration';
import { getBackdropUrl, getPosterUrl } from '@/services/tmdb/imageUrls';
import SectionWrapper from '@/components/SectionWrapper';
import Image from '@/components/Image';

const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
};

const formatVoteCount = (count: number): string => new Intl.NumberFormat('ko-KR').format(count);

export const MovieHero = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <SectionWrapper resetKeys={[id]}>
      <MovieHeroContent />
    </SectionWrapper>
  );
};

const MovieHeroContent = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id ? Number.parseInt(id, 10) : 0;

  const { data: config } = useSuspenseQuery(configurationQueryObj);
  const {
    data: { release_date, title, runtime, genres, overview, vote_average, vote_count, backdrop_path },
  } = useSuspenseQuery(movieDetailQuery(movieId));
  const { data: images } = useSuspenseQuery(movieImagesQuery(movieId));

  const logo = images.logos?.[0];
  const releaseYear = release_date?.split('-')[0] ?? '';

  return (
    <div className={styles.hero}>
      <section className={styles.movieInfoSection}>
        {logo && (
          <Image
            src={getPosterUrl(logo.file_path, config, 'w500')}
            alt={`${title} 로고`}
            className={styles.logo}
            fallbackSrc="/placeholder.png"
          />
        )}
        <h1 className={styles.movieTitle}>{title}</h1>
        <div className={styles.movieInfoBar}>
          <span>{releaseYear}</span>
          <span>{formatRuntime(runtime)}</span>
          {genres?.map(({ id, name }) => (
            <span key={id}>{name}</span>
          ))}
        </div>
        <div className={styles.overviewContainer}>
          <p className={styles.overview}>{overview || '줄거리 정보가 없습니다.'}</p>
        </div>
        <div className={styles.statsList}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{vote_average.toFixed(1)}</span>
            <span className={styles.statLabel}>평점</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{formatVoteCount(vote_count)}</span>
            <span className={styles.statLabel}>평가</span>
          </div>
        </div>
        <div className={styles.statsListCompact}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{vote_average.toFixed(1)}</span>
            <span className={styles.statLabel}>평점</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{formatVoteCount(vote_count)}</span>
            <span className={styles.statLabel}>평가</span>
          </div>
        </div>
        <button className={styles.watchButton}>감상하기</button>
      </section>

      <section className={styles.backdropSection}>
        <div className={styles.backdropOverlay} />
        {backdrop_path && (
          <Image
            src={getBackdropUrl(backdrop_path, config, 'w1280')}
            alt={`${title} 배경`}
            className={styles.backdropImage}
            fallbackSrc="/placeholder.png"
          />
        )}
        <div className={styles.backdropStats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{vote_average.toFixed(1)}</span>
            <span className={styles.statLabel}>평점</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{formatVoteCount(vote_count)}</span>
            <span className={styles.statLabel}>평가</span>
          </div>
        </div>
      </section>
    </div>
  );
};
