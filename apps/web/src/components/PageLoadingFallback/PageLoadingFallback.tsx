import styles from './PageLoadingFallback.module.css';

export const PageLoadingFallback = ({ msg = '로딩 중입니다...' }: { msg?: string }) => {
  return (
    <div className={styles.pageLoading}>
      <div className="spinner" />
      <p className={styles.loadingText}>{msg}</p>
    </div>
  );
};
