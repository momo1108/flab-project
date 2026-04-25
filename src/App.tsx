import './styles.css';
import DogImage from './assets/1.jpg';
import React, { Suspense, useEffect, useState } from 'react';
import Button from './Button';
import { multiply } from './treeShakingTestModule';

interface AppProps {
  message?: string;
}

const loadImportantModule = () => import(/* webpackPreload: true */ './importantModule');
const loadSomeModule = () => import(/* webpackPrefetch: true */ './someModule');
const LazyButton = React.lazy(() => import('./LazyButton'));

const App: React.FC<AppProps> = ({ message = 'Hello' }) => {
  const [preloadResult, setPreloadResult] = useState<number | null>(null);
  const [prefetchResult, setPrefetchResult] = useState<number | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    fetch('/google').then(console.log);
  }, []);

  const handlePreloadClick = async () => {
    const { sum } = await loadImportantModule();
    setPreloadResult(sum(10, 20));
  };

  const handlePrefetchClick = async () => {
    const { sum } = await loadSomeModule();
    setPrefetchResult(sum(1, 2));
  };

  return (
    <div className="app-container">
      <h1>{message}, Webpack with React and TypeScript!</h1>
      <img src={DogImage} alt="예시 이미지" />
      <Button>테스트용5</Button>
      <div>
        <p>preload: 현재 화면에서 곧 사용할 중요한 모듈 예시</p>
        <Button onClick={handlePreloadClick}>importantModule 실행</Button>
        {preloadResult !== null && <p>importantModule 결과: {preloadResult}</p>}
      </div>
      <div>
        <p>prefetch: 지금은 아니지만 이후에 사용할 수 있는 모듈 예시</p>
        <Button onClick={handlePrefetchClick}>someModule 실행</Button>
        {prefetchResult !== null && <p>someModule 결과: {prefetchResult}</p>}
      </div>
      <Suspense fallback={<button>로딩중...</button>}>
        <LazyButton>레이지 버튼입니다</LazyButton>
      </Suspense>
      <p>3 * 5 = {multiply(3, 5)}</p>
    </div>
  );
};

export default App;
