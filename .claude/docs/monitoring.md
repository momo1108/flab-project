# 모니터링 및 로깅

## 에러 모니터링

### 클라이언트 에러 추적

```typescript
// 전역 에러 핸들러
const setupGlobalErrorHandling = () => {
  // 런타임 에러
  window.addEventListener('error', (event) => {
    console.error('[Global Error]', event.message, event.filename, event.lineno);
    logErrorToMonitoringService({
      type: 'runtime',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      stack: event.error?.stack,
    });
  });

  // Promise rejection 에러
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[Unhandled Promise Rejection]', event.reason);
    logErrorToMonitoringService({
      type: 'promise',
      reason: event.reason,
      stack: event.reason?.stack,
    });
  });
};

// 모니터링 서비스 로깅 (예시)
const logErrorToMonitoringService = (error: ErrorInfo) => {
  if (import.meta.env.PROD) {
    // 프로덕션에서만 모니터링 서비스로 전송
    // sendToSentry(error);
    // sendToLogRocket(error);
    console.error('[Production Error]', error);
  }
};

// App.tsx에서 초기화
useEffect(() => {
  setupGlobalErrorHandling();
}, []);
```

### Tanstack Query 에러 모니터링

```typescript
// api/client.ts
import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error('[Query Error]', error, query);
      logApiError({
        type: 'query',
        queryKey: query.queryKey,
        error: error as Error,
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, variables, context, mutation) => {
      console.error('[Mutation Error]', error, variables);
      logApiError({
        type: 'mutation',
        variables,
        error: error as Error,
      });
    },
  }),
});
```

### API 에러 로깅

```typescript
// api/tmdb/client.ts
const tmdbFetch = async <T>(endpoint: string): Promise<T> => {
  const apiKey = import.meta.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3${endpoint}`;

  const startTime = performance.now();

  try {
    const response = await fetch(url);
    const endTime = performance.now();
    const duration = endTime - startTime;

    // 성능 로깅
    console.log(`[API] ${endpoint} - ${duration.toFixed(2)}ms`);

    if (!response.ok) {
      const error = (await response.json()) as TmdbError;
      throw new TmdbApiError(response.status, error.status_message);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    // 에러 로깅
    console.error('[API Error]', endpoint, error);
    logApiError({
      type: 'tmdb',
      endpoint,
      error: error as Error,
    });
    throw error;
  }
};
```

---

## 성능 모니터링

### Web Vitals 측정

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

const reportWebVitals = (metric: Metric) => {
  console.log('[Web Vitals]', metric);

  // 모니터링 서비스로 전송
  if (import.meta.env.PROD) {
    sendToAnalytics(metric);
  }
};

// Web Vitals 측정 시작
const measureWebVitals = () => {
  getCLS(reportWebVitals); // Cumulative Layout Shift
  getFID(reportWebVitals); // First Input Delay
  getFCP(reportWebVitals); // First Contentful Paint
  getLCP(reportWebVitals); // Largest Contentful Paint
  getTTFB(reportWebVitals); // Time to First Byte
};

// App.tsx에서 초기화
useEffect(() => {
  measureWebVitals();
}, []);
```

### React Profiler

```typescript
import { Profiler } from 'react';

const onRenderCallback = (
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number,
  interactions: Set<Interaction>
) => {
  console.log('[Profiler]', {
    id,
    phase,
    actualDuration: `${actualDuration.toFixed(2)}ms`,
    baseDuration: `${baseDuration.toFixed(2)}ms`,
    interactions: Array.from(interactions).map(i => i.id),
  });

  // 모니터링 서비스로 전송
  if (actualDuration > 16) { // 60fps 기준 (16ms 초과)
    logSlowComponent({
      id,
      phase,
      actualDuration,
      baseDuration,
    });
  }
};

// 사용 예시
<Profiler id="MainPage" onRender={onRenderCallback}>
  <MainPage />
</Profiler>
```

---

## CloudWatch 모니터링

### CloudFront 메트릭

```bash
# CloudFront 지표 조회
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name Requests \
  --dimensions Name=DistributionId,Value=E123ABCDEF \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-01T23:59:59Z \
  --period 3600 \
  --statistics Sum

# 에러율 모니터링
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name 4xxErrorRate \
  --dimensions Name=DistributionId,Value=E123ABCDEF \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-01T23:59:59Z \
  --period 3600 \
  --statistics Average
```

### CloudWatch 경보 설정

```bash
# 높은 에러율 경보
aws cloudwatch put-metric-alarm \
  --alarm-name "HighErrorRate" \
  --alarm-description "Alert when 4xx error rate exceeds 5%" \
  --metric-name 4xxErrorRate \
  --namespace AWS/CloudFront \
  --statistic Average \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold

# 낮은 캐시 적중률 경보
aws cloudwatch put-metric-alarm \
  --alarm-name "LowCacheHitRate" \
  --alarm-description "Alert when cache hit rate falls below 50%" \
  --metric-name CacheHitRate \
  --namespace AWS/CloudFront \
  --statistic Average \
  --period 3600 \
  --threshold 50 \
  --comparison-operator LessThanThreshold
```

---

## 로그 관리

### 클라이언트 로깅

```typescript
// utils/logger.ts
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const logger = {
  info: (message: string, data?: unknown) => {
    if (import.meta.env.DEV) {
      console.log(`[INFO] ${message}`, data);
    }
  },

  warn: (message: string, data?: unknown) => {
    console.warn(`[WARN] ${message}`, data);
  },

  error: (message: string, error?: Error | unknown) => {
    console.error(`[ERROR] ${message}`, error);

    if (import.meta.env.PROD) {
      // 프로덕션에서는 에러 추적 서비스로 전송
      sendErrorToTracking(message, error);
    }
  },

  debug: (message: string, data?: unknown) => {
    if (import.meta.env.DEV) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  },

  api: (endpoint: string, duration: number, status?: number) => {
    const statusText = status ? `(${status})` : '';
    console.log(`[API] ${endpoint} ${statusText} - ${duration.toFixed(2)}ms`);
  },
};

export default logger;
```

### CloudFront 로그

```bash
# S3 버킷에서 CloudFront 로그 확인
aws s3 ls s3://watcha-clone-logs/cloudfront/

# 최신 로그 다운로드
aws s3 cp s3://watcha-clone-logs/cloudfront/latest.log ./logs/

# 로그 분석 (404 에러 추출)
grep " 404 " ./logs/latest.log | wc -l
```

---

## 사용자 행동 추적 (선택사항)

### Google Analytics 통합

```typescript
// utils/analytics.ts
export const trackPageView = (page: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: page,
    });
  }
};

export const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, parameters);
  }
};

// 사용 예시
trackPageView('/movie/123');
trackEvent('search', { search_term: 'Batman' });
```

---

## 개발자 도구 통합

### React DevTools Profiler

```typescript
// 개발 모드에서만 Profiler 활성화
const isDev = import.meta.env.DEV;

const MainPage = () => {
  const { data, isLoading } = usePopularMovies();

  if (isLoading) return <SkeletonLoader />;

  return (
    <>
      {isDev && (
        <Profiler id="MainPage" onRender={onRenderCallback}>
          <MovieGrid movies={data || []} />
        </Profiler>
      )}
      {!isDev && <MovieGrid movies={data || []} />}
    </>
  );
};
```

---

## 모니터링 대시보드 구성

### 주요 모니터링 지표

#### 성능 지표

- **FCP**: First Contentful Paint < 1.5s
- **LCP**: Largest Contentful Paint < 2.5s
- **FID**: First Input Delay < 100ms
- **CLS**: Cumulative Layout Shift < 0.1

#### API 지표

- **응답 시간**: < 1s (p95)
- **에러율**: < 5% (4xx)
- **캐시 적중률**: > 50%

#### CloudFront 지표

- **요청 수**: 시간대별 추이
- **에러율**: 4xx/5xx
- **캐시 적중률**
- **대역폭 사용량**

---

## 에이전트 개발 시 모니터링 가이드

### 필수 모니터링 포인트

1. **API 호출**: 모든 TMDB API 호출 로깅
2. **에러 발생**: 런타임, Promise, API 에러 추적
3. **성능**: Web Vitals 측정
4. **사용자 경험**: 로딩 시간, 상호작용 시간

### 로깅 규칙

1. **개발 환경**: 상세한 콘솔 로그
2. **프로덕션 환경**: 필수 에러 및 경고만 로깅
3. **민감 정보**: API Key, 개인 정보 로깅 금지
4. **구조화 로그**: JSON 형식으로 일관된 로깅

### 모니터링 서비스 추천

- **에러 추적**: Sentry, Rollbar
- **성능 모니터링**: Google Analytics, Web Vitals
- **APM**: New Relic, Datadog (선택사항)

### 에러 알림 설정

- **즉시 알림**: 5xx 에러, 높은 에러율
- **일일 리포트**: 성능 지표, 사용자 행동
- **주간 리포트**: 전체 시스템 상태, 트렌드
