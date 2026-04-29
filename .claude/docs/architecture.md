# 시스템 아키텍처

## 전체 시스템 아키텍처

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
│  │  │  /collection/:id → CollectionDetailPage             │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │  Tanstack Query (State Management & Data Fetch)   │  │ │
│  │  │  - Query Key Factory                             │  │ │
│  │  │  - useConfiguration, useGenres, usePopularMovies  │  │ │
│  │  │  - useDiscoverMovies, useSearchMovies            │  │ │
│  │  │  - useMovieDetail, useCollectionDetail            │  │ │
│  │  │  - Caching (staleTime, gcTime)                    │  │ │
│  │  │  - Error Handling & Retry Logic                   │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │           Component Layer                         │  │ │
│  │  │  ├─ Header/Header, Footer/Footer                   │  │ │
│  │  │  ├─ Movie/MovieCard, MovieGrid                   │  │ │
│  │  │  ├─ Carousel/CarouselRow, CollectionCard        │  │ │
│  │  │  ├─ Carousel/ArtistCard                         │  │ │
│  │  │  ├─ Search/SearchBar, Pagination                 │  │ │
│  │  │  └─ Common/LoadingSpinner, ErrorMessage           │  │ │
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
│  - /configuration                                          │
│  - /genre/movie/list                                       │
│  - /discover/movie                                         │
│  - /movie/popular                                          │
│  - /search/movie                                           │
│  - /movie/{id}                                             │
│  - /collection/{id}                                         │
│  - /person/popular                                          │
│  - /person/{id}/movie_credits                              │
└──────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────┐
│                   CDN (TMDB Images)                          │
│  https://image.tmdb.org/t/p/{size}/{path}                   │
└──────────────────────────────────────────────────────────────┘
```

## 기술 스택 구성

### 프레임워크 및 라이브러리
- **React 19**: UI 렌더링, 컴포넌트 기반 아키텍처
- **TypeScript 6**: 타입 안전성, IDE 지원
- **React Router 7**: 클라이언트 사이드 라우팅
- **Tanstack Query 5**: 서버 상태 관리, 데이터 페칭

### 빌드 도구
- **Webpack 5**: 번들링, 코드 분할, 최적화

### 스타일링
- **CSS Modules**: 컴포넌트별 스타일 격리
- **PostCSS**: CSS 자동 프리픽싱, 최소화

### 코드 품질
- **ESLint 9**: 코드 품질 검사
- **Prettier**: 코드 포맷팅
- **Husky**: Git hooks
- **lint-staged**: 커밋 전 코드 검사

---

## 레이어 구조

### 1. UI 레이어
- 페이지 컴포넌트 (MainPage, SearchPage, DetailPage)
- 레이아웃 컴포넌트 (Header, Footer)
- 재사용 컴포넌트 (MovieCard, CarouselRow, SearchBar)

### 2. 라우팅 레이어
- React Router 7
- URL 파라미터 및 쿼리 파라미터 처리
- Lazy Loading으로 코드 분할

### 3. 상태 관리 레이어
- **서버 상태**: Tanstack Query
- **클라이언트 상태**: React useState, URL 상태

### 4. 데이터 페칭 레이어
- TMDB API 클라이언트
- 에러 처리 및 재시도 로직
- 캐싱 전략

### 5. 유틸리티 레이어
- 데이터 포맷팅
- 유효성 검사
- 에러 처리

---

## 데이터 흐름 아키텍처

### Unidirectional Data Flow

```
User Interaction → Component State → URL State → Query Key → API Call → Response → Cache → UI Update
```

### 페이지별 데이터 흐름

#### 메인페이지 데이터 흐름
```
MainPage 로드
    ↓
useConfiguration() + useGenres() 선호출 (캐시 1일)
    ↓
usePopularMovies() + useDiscoverMovies() 병렬 실행 (캐시 5분)
    ↓
useCollectionCandidates() → useCollectionDetail() 순차 실행 (캐시 5분)
    ↓
usePopularPersons() → usePersonCredits() 순차 실행 (캐시 10분)
    ↓
Tanstack Query에서 캐시 확인
    ├─ 캐시 있고 신선함 → 캐시된 데이터 사용
    ├─ 캐시 있으나 stale → 백그라운드 재요청 (UI는 캐시 사용)
    └─ 캐시 없음 → 즉시 API 요청
    ↓
TMDB API 호출
    ↓
응답 데이터 캐시 저장
    ↓
화면 렌더링
    ├─ 로딩 중: Skeleton Loading
    ├─ 성공: 캐러셀 섹션 렌더링
    └─ 실패: 에러 메시지 + 재시도 버튼
```

#### 검색페이지 데이터 흐름
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
Debouncing (300ms)
    ↓
Tanstack Query에서 캐시 확인
    ├─ 캐시 있고 신선함 → 캐시 사용
    └─ 캐시 없음/stale → API 요청
    ↓
TMDB /search/movie API 호출 (캐시 3분)
    ↓
응답 데이터 캐시 저장
    ↓
화면 렌더링 + 페이지네이션
```

#### 상세페이지 데이터 흐름
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
TMDB /movie/{id} API 호출 (캐시 10분)
    ↓
응답 데이터 캐시 저장
    ↓
화면 렌더링
    ├─ 포스터 + 배경 이미지 (병렬 로드)
    └─ 모든 정보 표시
```

---

## 상태 관리 아키텍처

### 서버 상태 (Tanstack Query)

```typescript
// 캐시 구조
QueryCache {
  'tmdb-configuration': { data, staleTime: 1일 },
  'tmdb-genres': { data, staleTime: 1일 },
  'movies-popular': { data, staleTime: 5분 },
  'movies-search-query:page:1': { data, staleTime: 3분 },
  'movies-detail-123': { data, staleTime: 10분 },
}
```

### 클라이언트 상태

```typescript
// URL 상태 (React Router)
useSearchParams() → { query, page }

// 컴포넌트 로컬 상태
useState() → { inputValue, isFocused, ... }
```

---

## 에이전트 개발 시 주의사항

1. **데이터 흐름**: Unidirectional Data Flow 준수
2. **캐시 정책**: 각 페이지별 캐시 staleTime/gcTime 설정
3. **캐시 전략**: Tanstack Query 캐시 + CloudFront CDN 캐시
4. **에러 처리**: 각 레이어별 적절한 에러 처리
5. **상태 동기화**: URL 상태 ↔ 서버 상태 동기화
6. **코드 분할**: 페이지별 Lazy Loading으로 번들 최적화