import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { MovieHero } from './sections/MovieHero';
import { MovieContentTab } from './sections/MovieContentTab';
import { RelatedContentTab } from './sections/RelatedContentTab';
import { MovieDetailFooter } from './sections/MovieDetailFooter';
import styles from './MovieDetailPage.module.css';
import SectionWrapper from '../../components/SectionWrapper';

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id ? Number.parseInt(id, 10) : 0;
  const [activeTab, setActiveTab] = useState<'content' | 'related'>('content');

  useEffect(() => {
    setActiveTab('content');
  }, [id]);

  // MovieHero는 핵심 섹션으로 실패 시 전체 페이지 에러를 표시
  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContainer}>
        <SectionWrapper resetKeys={[movieId]}>
          <MovieHero />
        </SectionWrapper>

        <div className={styles.contentSection}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${activeTab === 'content' ? styles.active : ''}`}
              onClick={() => setActiveTab('content')}
            >
              콘텐츠 정보
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'related' ? styles.active : ''}`}
              onClick={() => setActiveTab('related')}
            >
              관련 콘텐츠
            </button>
          </div>

          {activeTab === 'content' && <MovieContentTab />}
          {activeTab === 'related' && (
            <div className={`${styles.tabContent} ${styles.active}`}>
              <h2 className={styles.sectionTitle}>관련 콘텐츠</h2>
              <SectionWrapper resetKeys={[movieId]}>
                <RelatedContentTab />
              </SectionWrapper>
            </div>
          )}
        </div>
      </main>
      <SectionWrapper resetKeys={[movieId]}>
        <MovieDetailFooter />
      </SectionWrapper>
    </div>
  );
};

export default MovieDetailPage;
