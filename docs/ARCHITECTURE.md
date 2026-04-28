# Watcha 클론 프로젝트 시스템 아키텍처

## 1. 전체 시스템 아키텍처

```
┌──────────────────────────────────────────────────────────────┐
│                      Browser (Client)                         │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │             React 19 + TypeScript App                    │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │        React Router 7 (SPA Routing)               │  │ │
│  │  │  /  → MainPage                                    │  │ │
│  │  │  /search?query=x&page=y → SearchPage              │  │ │
│  │  │  /movie/:id → DetailPage                          │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │  Tanstack Query (State Management & Data Fetch)   │  │ │
│  │  │  - Query Key Factory                             │  │ │
│  │  │  - usePopularMovies, useSearchMovies, etc.        │  │ │
│  │  │  - Caching (staleTime, gcTime)                    │  │ │
│  │  │  - Error Handling & Retry Logic                   │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │           Component Layer                         │  │ │
│  │  │  ├─ Header                                        │  │ │
│  │  │  ├─ MovieCard                                     │  │ │
│  │  │  ├─ MovieGrid                                     │  │ │
│  │  │  ├─ SearchBar                                     │  │ │
│  │  │  └─ Pagination                                    │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │             Local Storage (Optional)                    │  │
│  │  - Search history                                       │  │
│  │  - User preferences                                     │  │
│  └─────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
           ↓ (HTTP/HTTPS)
┌──────────────────────────────────────────────────────────────┐
│                  TMDB API (External)                         │
│  https://api.themoviedb.org/3/                              │
│  - /movie/popular                                           │
│  - /movie/top_rated                                         │
│  - /movie/upcoming                                          │
│  - /search/movie                                            │
│  - /movie/{id}                                              │
└──────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────┐
│                   CDN (TMDB Images)                          │
│  https://image.tmdb.org/t/p/{size}/{path}                   │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. 배포 아키텍처 (CloudFront + S3)

```
┌─────────────────────────────────────────────────────────────┐
│                      End User                                │
│                   (브라우저 사용자)                           │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTPS 요청
                 ↓
┌──────────────────────────────────────────────────────────────┐
│              CloudFront (CDN)                                │
│  Distribution: d1234abc.cloudfront.net                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 기능:                                                   │ │
│  │ - 지리적 캐싱 (엣지 로케이션)                            │ │
│  │ - HTTPS/HTTP/2 지원                                    │ │
│  │ - 보안 (OAI를 통한 S3 접근 제한)                        │ │
│  │ - 캐시 정책:                                           │ │
│  │   * HTML: 5분 (변경 빈번)                             │ │
│  │   * JS/CSS: 1년 (콘텐츠 해시로 무효화)                 │ │
│  │   * 이미지: 1년                                       │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────┬──────────────────────────────────────────────┘
                 │ (OAI 인증)
                 ↓
┌──────────────────────────────────────────────────────────────┐
│              Amazon S3 Bucket                                │
│  watcha-clone-prod/                                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 구조:                                                   │ │
│  │ index.html                                             │ │
│  │ dist/                                                  │ │
│  │ ├─ js/                                                 │ │
│  │ │  └─ main.abc123.js (콘텐츠 해시)                    │ │
│  │ ├─ css/                                                │ │
│  │ │  └─ main.def456.css                                 │ │
│  │ └─ images/ (선택)                                     │ │
│  │                                                        │ │
│  │ 설정:                                                  │ │
│  │ - 정적 웹사이트 호스팅 활성화                          │ │
│  │ - 기본 루트 객체: index.html                           │ │
│  │ - 에러 문서: index.html (SPA 지원)                     │ │
│  │ - 버전 관리 비활성화                                   │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. 폴더 구조 및 파일 구성

```
flab-project/
├── public/
│   └── index.html                    # HTML 진입점
├── src/
│   ├── pages/
│   │   ├── MainPage.tsx
│   │   ├── SearchPage.tsx
│   │   ├── DetailPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── components/
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   └── Header.module.css
│   │   ├── MovieCard/
│   │   │   ├── MovieCard.tsx
│   │   │   └── MovieCard.module.css
│   │   ├── MovieGrid/
│   │   │   ├── MovieGrid.tsx
│   │   │   └── MovieGrid.module.css
│   │   ├── SearchBar/
│   │   │   ├── SearchBar.tsx
│   │   │   └── SearchBar.module.css
│   │   └── Pagination/
│   │       ├── Pagination.tsx
│   │       └── Pagination.module.css
│   ├── api/
│   │   ├── keys.ts                   # Query Key Factory
│   │   ├── queries/
│   │   │   ├── movies.ts             # usePopularMovies, useTopRated, etc.
│   │   │   └── search.ts             # useSearchMovies
│   │   └── client.ts                 # QueryClient 설정
│   ├── types/
│   │   ├── movie.ts                  # Movie, MovieDetail 타입
│   │   └── api.ts                    # API 응답 타입
│   ├── routes/
│   │   └── index.ts                  # 라우트 정의
│   ├── utils/
│   │   ├── constants.ts              # API_KEY, BASE_URL
│   │   └── formatters.ts             # 포맷팅 함수 (날짜, 평점)
│   ├── styles/
│   │   ├── global.css                # 전역 스타일
│   │   ├── MainPage.module.css
│   │   ├── SearchPage.module.css
│   │   └── DetailPage.module.css
│   ├── App.tsx                       # 루트 컴포넌트
│   ├── main.tsx                      # React DOM 렌더링
│   └── index.css                     # 기본 스타일
├── dist/                             # 빌드 아티팩트 (배포용)
├── webpack.common.js                 # Webpack 공통 설정
├── webpack.dev.js                    # 개발 서버 설정
├── webpack.prod.js                   # 프로덕션 빌드 설정
├── tsconfig.json                     # TypeScript 설정
├── REQUIREMENTS.md                   # 요구사항 정의서
├── SPECIFICATIONS.md                 # 기능 명세서
├── ARCHITECTURE.md                   # 시스템 아키텍처 (이 파일)
├── CLAUDE.md                         # 프로젝트 개발 가이드라인
├── package.json
├── babel.config.json
├── eslint.config.mjs
├── prettier.config.mjs
└── lint-staged.config.mjs
```

---

## 4. 데이터 흐름 (Data Flow)

### 4.1 메인페이지 데이터 흐름

```
MainPage 로드
    ↓
usePopularMovies() + useTopRatedMovies() + useUpcomingMovies() 실행 (동시)
    ↓
Tanstack Query에서 캐시 확인
    ├─ 캐시 있고 신선함 (not stale) → 캐시된 데이터 사용
    ├─ 캐시 있으나 stale → 백그라운드에서 재요청 (UI는 캐시 사용)
    └─ 캐시 없음 → 즉시 API 요청
    ↓
TMDB API 호출 (3개 요청)
    ↓
응답 데이터 캐시 저장 (staleTime: 5분)
    ↓
화면 렌더링
    ├─ 로딩 중: Skeleton Loading
    ├─ 성공: MovieGrid 렌더링
    └─ 실패: 에러 메시지 + 재시도 버튼
```

### 4.2 검색페이지 데이터 흐름

```
SearchPage 로드 (URL: ?query=keyword&page=1)
    ↓
useSearchParams() → query, page 추출
    ↓
useSearchMovies(query, page) 실행
    ↓
query.trim()이 비어있음?
    ├─ Yes → 쿼리 실행 안 함 (enabled: false)
    └─ No → 아래 진행
    ↓
Tanstack Query에서 캐시 확인
    ├─ 캐시 있고 신선함 → 캐시 사용
    └─ 캐시 없음/stale → API 요청
    ↓
TMDB /search/movie API 호출
    ↓
응답 데이터 캐시 저장 (staleTime: 3분)
    ↓
화면 렌더링 + 페이지네이션
```

### 4.3 상세페이지 데이터 흐름

```
DetailPage 로드 (URL: /movie/123)
    ↓
useParams() → id: 123 추출
    ↓
useMovieDetail(123) 실행
    ↓
id가 있는가?
    ├─ Yes → API 요청
    └─ No → 쿼리 실행 안 함 (enabled: false)
    ↓
Tanstack Query에서 캐시 확인
    ├─ 캐시 있고 신선함 → 캐시 사용
    └─ 캐시 없음/stale → API 요청
    ↓
TMDB /movie/{id} API 호출
    ↓
응답 데이터 캐시 저장 (staleTime: 10분)
    ↓
화면 렌더링
    ├─ 포스터 + 배경 이미지 (병렬 로드)
    └─ 모든 정보 표시
```

---

## 5. 상태 관리 (State Management)

### 5.1 Tanstack Query (서버 상태)

```typescript
// 서버 상태: API에서 가져온 데이터
- usePopularMovies() → { data, isLoading, error, refetch, ... }
- useSearchMovies(query) → { data, isLoading, error, ... }
- useMovieDetail(id) → { data, isLoading, error, ... }

// Query Key 구조
['movies', 'popular'] // 인기
['movies', 'topRated'] // 평점
['movies', 'upcoming'] // 개봉예정
['movies', 'search', { query: 'Batman', page: 1 }] // 검색
['movies', 'detail', 123] // 상세
```

### 5.2 컴포넌트 로컬 상태 (Client State)

```typescript
// SearchPage
const [searchParams, setSearchParams] = useSearchParams();
// {query, page}

// SearchBar
const [input, setInput] = useState('');
// 검색 입력값
```

### 5.3 상태 동기화

```
URL ↔ useSearchParams() ↔ useSearchMovies(query)
        ↓                    ↓
    브라우저 히스토리    Tanstack Query 캐시
```

---

## 6. 캐싱 전략

### 6.1 Tanstack Query 캐싱

| 쿼리     | staleTime | gcTime | 용도                |
| -------- | --------- | ------ | ------------------- |
| popular  | 5분       | 10분   | 메인페이지 인기영화 |
| topRated | 5분       | 10분   | 메인페이지 평점     |
| upcoming | 5분       | 10분   | 메인페이지 개봉예정 |
| search   | 3분       | 5분    | 검색 결과           |
| detail   | 10분      | 15분   | 상세페이지          |

### 6.2 CloudFront 캐싱

| 파일       | TTL | 전략                          |
| ---------- | --- | ----------------------------- |
| index.html | 5분 | 변경 빈번, 콘텐츠 해시 미사용 |
| \*.js      | 1년 | 콘텐츠 해시 (main.abc123.js)  |
| \*.css     | 1년 | 콘텐츠 해시 (main.def456.css) |
| 이미지     | 1년 | 콘텐츠 해시 (선택사항)        |

### 6.3 캐시 무효화

```bash
# 배포 후 CloudFront 캐시 무효화 (선택)
aws cloudfront create-invalidation \
  --distribution-id E123ABC \
  --paths "/*"
```

---

## 7. 에러 처리 전략

### 7.1 API 에러

```typescript
// Query에서 에러 처리
try {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
} catch (error) {
  // Tanstack Query의 error 상태로 전달
}

// 재시도 로직
useQuery({
  ...,
  retry: 1, // 1회 재시도
  retryDelay: 1000, // 1초 대기 후 재시도
})
```

### 7.2 컴포넌트 에러 처리

```typescript
if (isLoading) return <SkeletonLoading />;
if (error) return <ErrorMessage error={error} onRetry={refetch} />;
if (!data) return <EmptyState />;

return <Content data={data} />;
```

---

## 8. 보안 고려사항

### 8.1 API Key 관리

```
환경변수: REACT_APP_TMDB_API_KEY
├─ 로컬 개발: .env.local
├─ CI/CD: GitHub Secrets (또는 AWS Secrets Manager)
└─ 프로덕션: 환경변수 주입
```

### 8.2 CORS (Cross-Origin Resource Sharing)

- TMDB API는 CORS 지원
- CloudFront에서 HTTPS 강제화

### 8.3 S3 보안

```
- 퍼블릭 액세스 차단: 적용
- CloudFront OAI: 필수 (S3 직접 접근 방지)
- 버킷 정책: CloudFront OAI만 허용
```

---

## 9. 성능 최적화

### 9.1 코드 분할 (Code Splitting)

```typescript
const MainPage = lazy(() => import('../pages/MainPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const DetailPage = lazy(() => import('../pages/DetailPage'));
```

### 9.2 이미지 최적화

```
TMDB 이미지 크기:
- 카드: w500 (500px 너비)
- 배경: original 또는 w1280
- CDN: image.tmdb.org (자동 캐시)
```

### 9.3 Webpack 최적화

```javascript
// Webpack 설정
- Tree Shaking: 사용하지 않는 코드 제거
- Code Splitting: 페이지별 번들 분리
- Asset Minification: JS/CSS 압축
- Source Maps: 프로덕션에서 비활성화
```

### 9.4 번들 크기 분석

```bash
npm run build:production
# webpack-bundle-analyzer로 시각화 가능
```

---

## 10. 배포 프로세스

### 10.1 로컬 빌드

```bash
npm run build:production
# → dist/ 폴더 생성
```

### 10.2 S3 배포

```bash
aws s3 sync dist/ s3://watcha-clone-prod/ --delete
```

### 10.3 CloudFront 캐시 무효화 (선택)

```bash
aws cloudfront create-invalidation \
  --distribution-id {DISTRIBUTION_ID} \
  --paths "/index.html"
```

### 10.4 배포 자동화 (선택)

```bash
# GitHub Actions / GitLab CI / AWS CodeDeploy
# 스크립트: .github/workflows/deploy.yml
```

---

## 11. 모니터링 및 로깅 (선택사항)

### 11.1 에러 모니터링

- Sentry (또는 Rollbar)
- API 에러 + 런타임 에러 추적

### 11.2 성능 모니터링

- Google Analytics
- CloudFront 로그 분석

### 11.3 로깅

```typescript
console.log('[API]', url, response);
console.error('[ERROR]', error);
```

---

## 12. 개발 및 프로덕션 환경 설정

### 12.1 개발 환경

```bash
npm start
# Webpack Dev Server
# - HMR (Hot Module Replacement)
# - 포트: 3000
# - Proxy: TMDB API (CORS 우회, 선택사항)
```

### 12.2 프로덕션 환경

```bash
npm run build:production
# Webpack 프로덕션 빌드
# - 코드 최소화
# - Source Maps 제외
# - 최적화 활성화
```

### 12.3 환경변수

```
.env.local (로컬)
REACT_APP_TMDB_API_KEY=xxxxx

.env.production (배포)
REACT_APP_TMDB_API_KEY=xxxxx
REACT_APP_API_BASE_URL=https://api.themoviedb.org/3
```
