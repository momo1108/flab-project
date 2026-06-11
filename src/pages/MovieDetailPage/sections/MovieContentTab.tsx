import { VideosSubsection } from './subsections/VideosSubsection';
import { CreditsSubsection } from './subsections/CreditsSubsection';
import { ReviewsSubsection } from './subsections/ReviewsSubsection';
import styles from '../MovieDetailPage.module.css';

export const MovieContentTab = () => {
  return (
    <div className={`${styles.tabContent} ${styles.active}`}>
      <VideosSubsection />
      <CreditsSubsection />
      <ReviewsSubsection />
    </div>
  );
};
