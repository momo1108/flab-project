import { Link } from '@tanstack/react-router';
import type { FallbackProps } from 'react-error-boundary';

export const MovieDetailError = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="error">
      <p className="errorMessage">{error instanceof Error ? error.message : '영화 정보를 불러오지 못했습니다.'}</p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={resetErrorBoundary} className="retryButton">
          다시 시도
        </button>
        <Link to="/">
          <button className="retryButton">홈으로 이동</button>
        </Link>
      </div>
    </div>
  );
};
