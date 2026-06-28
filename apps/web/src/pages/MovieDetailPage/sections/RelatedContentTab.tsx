import { Link, useParams } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { similarMoviesQuery } from '@/services/tmdb/queries/movies';
import styles from '../MovieDetailPage.module.css';
import { getPosterUrl } from '@/services/tmdb/imageUrls';
import { configurationQueryObj } from '@/services/tmdb/queries/configuration';
import SectionWrapper from '@/components/SectionWrapper';
import { Image } from '@flab/ui';

export const RelatedContentTab = () => {
  const { movieId: id } = useParams({ from: '/movie/$movieId' });

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
  const { movieId: id } = useParams({ from: '/movie/$movieId' });
  const movieId = id ? Number.parseInt(id, 10) : 0;

  const { data: config } = useSuspenseQuery(configurationQueryObj);
  const {
    data: { results: similarMovies },
  } = useSuspenseQuery(similarMoviesQuery(movieId, 1, true, 16));

  return similarMovies.length > 0 ? (
    <div className={styles.similarMoviesGrid}>
      {similarMovies.map(({ id, poster_path, title }) => (
        <Link key={id} to={`/movie/$movieId`} params={{ movieId: id.toString() }} className={styles.similarMovieItem}>
          <Image
            src={getPosterUrl(poster_path, config, 'w500')}
            alt={title}
            className={styles.similarMoviePoster}
            fallbackSrc="/placeholder.png"
          />
        </Link>
      ))}
    </div>
  ) : (
    <p className={styles.emptyState}>관련 영화가 없습니다.</p>
  );
};
