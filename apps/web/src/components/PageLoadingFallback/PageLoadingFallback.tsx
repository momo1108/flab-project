import styles from './PageLoadingFallback.module.css';

export const PageLoadingFallback = () => {
  return (
    <div className={styles.pageLoading}>
      <div className="spinner" />
      <p className={styles.loadingText}>페이지를 불러오는 중...</p>
    </div>
  );
};
