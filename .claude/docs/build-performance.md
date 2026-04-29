# 빌드 및 성능 최적화

## Webpack 최적화

### 코드 분할 (Code Splitting)

```typescript
// Lazy Loading으로 번들 크기 최적화
const HomePage = lazy(() => import('../pages/HomePage'));
const DetailPage = lazy(() => import('../pages/DetailPage'));

// 웹팩 청크 이름 지정
const HeavyComponent = lazy(() =>
  import(/* webpackChunkName: "heavy" */ '../components/HeavyComponent')
);

// Preload와 Prefetch
const ImportantComponent = lazy(() =>
  import(/* webpackPreload: true */ '../components/ImportantComponent')
);

const FutureComponent = lazy(() =>
  import(/* webpackPrefetch: true */ '../components/FutureComponent')
);
```

### Terser Plugin 설정

```javascript
// webpack.config.js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // 콘솔 제거
            drop_debugger: true, // 디버거 제거
            pure_funcs: ['console.log', 'console.info'], // 특정 함수 제거
          },
          output: {
            comments: false, // 주석 제거
          },
        },
        extractComments: false, // 라이선스 주석 분리 비활성화
      }),
    ],
  },
};
```

### SplitChunks 설정

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/,
          name: 'react',
          priority: 20,
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```

## CSS 최적화

### PostCSS 설정

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('cssnano')({
      preset: 'default',
    }),
    require('autoprefixer'),
  ],
};
```

### CSS Modules 최적화

```css
/* 컴포넌트별로 CSS를 분리하여 로드 */
.container {
  /* 로컬 스코프로 중복 방지 */
}
```

## 번들 분석

### Webpack Bundle Analyzer

```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: false,
    }),
  ],
};
```

```bash
# 번들 분석 실행
npm run build:production
```

## 성능 모니터링

### React DevTools Profiler

```typescript
import { Profiler } from 'react';

<Profiler id="UserProfile" onRender={onRenderCallback}>
  <UserProfile />
</Profiler>;
```

```typescript
const onRenderCallback = (
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) => {
  console.log(`${id} ${phase} took ${actualDuration}ms`);
};
```

## 빌드 최적화 체크리스트

### 개발 환경
- [ ] HMR (Hot Module Replacement) 활성화
- [ ] Source Map 생성
- [ ] 빠른 빌드 시간

### 프로덕션 환경
- [ ] 코드 압축 (Terser)
- [ ] Tree Shaking 활성화
- [ ] 코드 분할 적용
- [ ] CSS 압축
- [ ] 이미지 최적화
- [ ] Gzip 압축
- [ ] CDN 사용

## 번들 크기 최적화 팁

1. **불필요한 의존성 제거**: `npm ls`로 사용하지 않는 패키지 확인
2. **Tree Shaking**: ES6 모듈 사용하고 사이드 이펙트 없는 패키지 선택
3. **이미지 최적화**: WebP 포맷 사용, lazy loading 적용
4. **폰트 최적화**: 서브셋 폰트 사용, WOFF2 포맷
5. **코드 분할**: 라우트별, 기능별로 번들 분리

## FLAB 프로젝트 성능 요구사항

### 핵심 성능 지표

- **페이지 초기 로드 시간**: < 3초
- **FCP (First Contentful Paint)**: < 1.5s
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 이미지 최적화

#### TMDB 이미지 크기 표준
```typescript
// 이미지 크기별 URL 생성
const getImageUrl = (path: string, size: ImageSize = 'w500'): string => {
  const baseUrl = configuration.images.secure_base_url;
  return `${baseUrl}${size}${path}`;
};

// 용도별 이미지 크기
const imageSizes = {
  card: 'w500',        // 영화 카드용
  backdrop: 'original', // 배경 이미지용
  profile: 'w185',     // 인물 프로필용
  poster: 'w342',      // 포스터용
} as const;
```

#### Lazy Loading 적용
```typescript
import { LazyLoadImage } from 'react-lazy-load-image-component';

<LazyLoadImage
  src={getImageUrl(movie.poster_path, 'w500')}
  alt={movie.title}
  placeholderSrc="/placeholder.png"
  effect="blur"
/>
```

### 코드 분할 전략

```typescript
// 페이지별 Lazy Loading
const MainPage = lazy(() => import('../pages/MainPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const DetailPage = lazy(() => import('../pages/DetailPage'));
const CollectionDetailPage = lazy(() => import('../pages/CollectionDetailPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Suspense로 로딩 상태 처리
<Suspense fallback={<SkeletonLoader />}>
  <Routes>
    {/* 라우트 정의 */}
  </Routes>
</Suspense>
```

### CloudFront 캐시 정책

```javascript
// CloudFront 배포 설정
const cachePolicies = {
  html: {
    MinTTL: 300,        // 5분
    DefaultTTL: 300,    // 5분
    MaxTTL: 300,       // 5분
  },
  assets: {
    MinTTL: 31536000,   // 1년
    DefaultTTL: 31536000, // 1년
    MaxTTL: 31536000,   // 1년
  },
};

// 캐시 헤더 설정
const getCacheHeaders = (path: string) => {
  if (path.endsWith('.html')) {
    return {
      'Cache-Control': 'public, max-age=300',
    };
  } else {
    return {
      'Cache-Control': 'public, max-age=31536000, immutable',
    };
  }
};
```

### Debouncing 최적화

```typescript
// 검색 입력 디바운싱
import { useDebouncedValue } from './hooks/useDebouncedValue';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300); // 300ms 디바운싱
  
  const { data, isLoading } = useSearchMovies(debouncedQuery);
  
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
};
```

### 성능 측정 도구

#### Lighthouse 점수
- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 90
- **SEO**: > 90

#### Web Vitals 모니터링
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const reportWebVitals = (metric: any) => {
  console.log(metric);
  // 분석 서비스로 전송
  // sendToAnalytics(metric);
};

getCLS(reportWebVitals);
getFID(reportWebVitals);
getFCP(reportWebVitals);
getLCP(reportWebVitals);
getTTFB(reportWebVitals);
```

### 프로덕션 빌드 최적화

```javascript
// webpack.config.js 프로덕션 설정
module.exports = {
  mode: 'production',
  optimization: {
    minimize: true,
    removeEmptyChunks: true,
    removeAvailableModules: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|@tanstack)[\\/]/,
          name: 'react',
          priority: 20,
        },
      },
    },
  },
  performance: {
    maxEntrypointSize: 512000, // 500KB
    maxAssetSize: 512000,       // 500KB
  },
};
```
