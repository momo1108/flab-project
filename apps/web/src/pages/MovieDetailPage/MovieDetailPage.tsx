import { MovieHero } from './sections/MovieHero';
import { MovieDetailFooter } from './sections/MovieDetailFooter';
import styles from './MovieDetailPage.module.css';
import { MovieMain } from './sections/MovieMain';

const MovieDetailPage = () => {
  // MovieHero는 핵심 섹션으로 실패 시 전체 페이지 에러를 표시
  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContainer}>
        <MovieHero />
        <MovieMain />
      </main>
      <MovieDetailFooter />
    </div>
  );
};

export default MovieDetailPage;
