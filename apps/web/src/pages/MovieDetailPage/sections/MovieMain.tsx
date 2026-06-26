import { useEffect, useState } from 'react';
import styles from '../MovieDetailPage.module.css';
import { MovieContentTab } from './MovieContentTab';
import { RelatedContentTab } from './RelatedContentTab';
import { useParams } from 'react-router';

export const MovieMain = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'content' | 'related'>('content');

  useEffect(() => {
    // id가 변경될 때마다 activeTab을 'content'로 초기화
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveTab('content');
  }, [id]);

  return (
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
      {activeTab === 'related' && <RelatedContentTab />}
    </div>
  );
};
