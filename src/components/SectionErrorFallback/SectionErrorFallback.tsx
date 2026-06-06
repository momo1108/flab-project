import type { FallbackProps } from 'react-error-boundary';
import styles from './SectionErrorFallback.module.css';

export const SectionErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  console.error(error);

  return (
    <div className={styles.container}>
      <p>섹션을 불러오는데 실패했습니다.</p>
      <button onClick={resetErrorBoundary} className={styles.retryButton}>
        다시 시도
      </button>
    </div>
  );
};
