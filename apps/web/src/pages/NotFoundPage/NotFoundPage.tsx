import { Link } from '@tanstack/react-router';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.description}>페이지를 찾을 수 없습니다</p>
        <p className={styles.subdescription}>주소를 확인하거나 홈으로 이동해주세요.</p>
        <Link to="/" className={styles.homeButton}>
          홈으로 이동
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
