import { Link, useParams } from 'react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { similarMoviesQuery } from '@/services/tmdb/queries/moviesQueries';
import styles from '../MovieDetailPage.module.css';
import { getPosterUrl } from '@/services/tmdb/imageUrls';
import { configurationQueryObj } from '@/services/tmdb/queries/configurationQueries';
import SectionWrapper from '@/components/SectionWrapper';

export const RelatedContentTab = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className={`${styles.tabContent} ${styles.active}`}>
      <h2 className={styles.sectionTitle}>관련 콘텐츠</h2>
      <SectionWrapper resetKeys={[id]}>
        <RelatedContentTabContent />
      </SectionWrapper>
    </div>
  );
};

const RelatedContentTabContent = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id ? Number.parseInt(id, 10) : 0;

  const { data: config } = useSuspenseQuery(configurationQueryObj);
  const {
    data: { results: similarMovies },
  } = useSuspenseQuery(similarMoviesQuery(movieId, 1, true, 16));

  return similarMovies.length > 0 ? (
    <div className={styles.similarMoviesGrid}>
      {similarMovies.map(({ id, poster_path, title }) => (
        <Link key={id} to={`/movie/${id}`} className={styles.similarMovieItem}>
          <img src={getPosterUrl(poster_path, config, 'w500')} alt={title} className={styles.similarMoviePoster} />
        </Link>
      ))}
    </div>
  ) : (
    <p className={styles.emptyState}>관련 영화가 없습니다.</p>
  );
};
