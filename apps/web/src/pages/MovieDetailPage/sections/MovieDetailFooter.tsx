import { useParams } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { movieDetailQuery } from '@/services/tmdb/queries/movie';
import styles from '../MovieDetailPage.module.css';
import SectionWrapper from '@/components/SectionWrapper';

export const MovieDetailFooter = () => {
  const { movieId: id } = useParams({ from: '/movie/$movieId' });

  return (
    <SectionWrapper resetKeys={[id]}>
      <MovieDetailFooterContent />
    </SectionWrapper>
  );
};

const MovieDetailFooterContent = () => {
  const { movieId: id } = useParams({ from: '/movie/$movieId' });
  const movieId = id ? Number.parseInt(id, 10) : 0;

  const { data: movie } = useSuspenseQuery(movieDetailQuery(movieId));

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <h2 className={styles.footerTitle}>{movie.title}</h2>
        <button className={styles.watchButton}>감상하기</button>
      </div>
    </footer>
  );
};
