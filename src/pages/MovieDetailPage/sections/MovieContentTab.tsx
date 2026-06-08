import { VideosSubsection } from './subsections/VideosSubsection';
import { CreditsSubsection } from './subsections/CreditsSubsection';
import { ReviewsSubsection } from './subsections/ReviewsSubsection';
import styles from '../MovieDetailPage.module.css';
import SectionWrapper from '@/components/SectionWrapper';
import { useParams } from 'react-router';

export const MovieContentTab = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className={`${styles.tabContent} ${styles.active}`}>
      <div className={styles.subsection}>
        <h2 className={styles.sectionTitle}>관련 동영상</h2>
        <SectionWrapper resetKeys={[id]}>
          <VideosSubsection />
        </SectionWrapper>
      </div>
      <div className={styles.subsection}>
        <h2 className={styles.sectionTitle}>감독/출연</h2>
        <SectionWrapper resetKeys={[id]}>
          <CreditsSubsection />
        </SectionWrapper>
      </div>
      <div className={styles.subsection}>
        <h2 className={styles.sectionTitle}>사용자 평</h2>
        <SectionWrapper resetKeys={[id]}>
          <ReviewsSubsection />
        </SectionWrapper>
      </div>
    </div>
  );
};
