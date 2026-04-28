# Watcha 클론 프로젝트 기능 명세서

## 1. 페이지별 상세 명세

---

## 1.1 메인 페이지 (MainPage)

### 화면 구조

```
┌─────────────────────────────────────┐
│ Header (로고, 검색바)                  │
├─────────────────────────────────────┤
│ 인기 영화 섹션                         │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │
│ │ 🎬  │ │ 🎬  │ │ 🎬  │ │ 🎬  │... │
│ └─────┘ └─────┘ └─────┘ └─────┘    │
├─────────────────────────────────────┤
│ 상위 평점 섹션                        │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │
│ │ 🎬  │ │ 🎬  │ │ 🎬  │ │ 🎬  │... │
│ └─────┘ └─────┘ └─────┘ └─────┘    │
├─────────────────────────────────────┤
│ 개봉예정 영화 섹션                    │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │
│ │ 🎬  │ │ 🎬  │ │ 🎬  │ │ 🎬  │... │
│ └─────┘ └─────┘ └─────┘ └─────┘    │
└─────────────────────────────────────┘
```

### 데이터 흐름

```
MainPage
├── usePopularMovies() → movieData
├── useTopRatedMovies() → movieData
├── useUpcomingMovies() → movieData
└── Render sections with MovieGrid
```

### 상호작용

| 사용자 액션   | 시스템 반응                        |
| ------------- | ---------------------------------- |
| 페이지 진입   | 3개 섹션의 API 호출 (동시 요청)    |
| 영화카드 호버 | 스케일 확대 + 포인터 커서          |
| 영화카드 클릭 | `/movie/{id}` 라우팅               |
| 스크롤 (하단) | 선택: 자동 로드 또는 "더보기" 버튼 |

### 로딩 상태

- 각 섹션별 Skeleton Loading (3행 4열)
- 에러 시: 재시도 버튼 표시

### 캐시 정책

- staleTime: 5분
- gcTime: 10분

---

## 1.2 검색 페이지 (SearchPage)

### 화면 구조

```
┌─────────────────────────────────────┐
│ Header (로고, 검색바)                  │
├─────────────────────────────────────┤
│ 검색 필터 (선택)                       │
│ [연도 ▼] [장르 ▼]                    │
├─────────────────────────────────────┤
│ 검색 결과: "query" (총 123개)         │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │
│ │ 🎬  │ │ 🎬  │ │ 🎬  │ │ 🎬  │    │
│ └─────┘ └─────┘ └─────┘ └─────┘    │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │
│ │ 🎬  │ │ 🎬  │ │ 🎬  │ │ 🎬  │    │
│ └─────┘ └─────┘ └─────┘ └─────┘    │
├─────────────────────────────────────┤
│ [◀ 이전] [1] [2] [3] ... [다음 ▶]    │
└─────────────────────────────────────┘
```

### 데이터 흐름

```
SearchPage
├── useSearchParams() → query, page 추출
├── useSearchMovies(query, page) → results
└── Render MovieGrid + Pagination
```

### 상호작용

| 사용자 액션           | 시스템 반응                  |
| --------------------- | ---------------------------- |
| 검색바 입력           | Debounce (300ms) 후 API 호출 |
| Enter 키              | 즉시 검색                    |
| 검색 결과 카드 클릭   | `/movie/{id}` 라우팅         |
| 페이지 번호 클릭      | URL 업데이트 + 결과 조회     |
| 뒤로/앞으로 버튼 클릭 | 페이지 이동                  |

### 특수 상태

| 상태      | 표시 내용                     |
| --------- | ----------------------------- |
| 초기 로드 | 빈 상태 또는 인기 검색어      |
| 검색 중   | Skeleton Loading              |
| 결과 없음 | "검색 결과가 없습니다" 메시지 |
| 에러 발생 | 재시도 버튼 + 에러 메시지     |

### 캐시 정책

- staleTime: 3분
- gcTime: 5분
- 페이지별 캐시 별도 관리

---

## 1.3 상세 페이지 (DetailPage)

### 화면 구조

```
┌─────────────────────────────────────┐
│ Header (로고, 검색바)                  │
├─────────────────────────────────────┤
│ ████████████████████████████████     │
│ ████ 배경 이미지 (Backdrop) ███████  │
│ ████████████████████████████████     │
│                                      │
│ ┌─────┐  영화 제목                   │
│ │포스터│  ⭐ 8.5/10                 │
│ │이미지│  📅 2024-01-15               │
│ │     │  ⏱️ 148분                   │
│ │     │  🎭 액션, 드라마              │
│ └─────┘  제작사: XXX                │
│          태그라인: "최고의 영화"       │
├─────────────────────────────────────┤
│ 줄거리                               │
│ Lorem ipsum dolor sit amet...       │
│ [... 더 보기] (선택)                 │
├─────────────────────────────────────┤
│ [뒤로가기]                            │
└─────────────────────────────────────┘
```

### 데이터 흐름

```
DetailPage
├── useParams() → id 추출
├── useMovieDetail(id) → movieDetail
└── Render detail layout
```

### 상호작용

| 사용자 액션         | 시스템 반응                        |
| ------------------- | ---------------------------------- |
| 페이지 진입         | 영화 ID 기반 상세정보 API 호출     |
| 배경/포스터 로딩 중 | 플레이스홀더 표시                  |
| 뒤로가기 클릭       | 이전 페이지로 이동                 |
| 브라우저 뒤로가기   | 이전 페이지로 이동 (히스토리 유지) |

### 특수 상태

| 상태             | 표시 내용                                   |
| ---------------- | ------------------------------------------- |
| 로딩 중          | Skeleton Loading (레이아웃만)               |
| 데이터 로드 완료 | 전체 정보 표시                              |
| 에러 발생        | "영화 정보를 불러올 수 없습니다" + 뒤로가기 |
| 영화 없음 (404)  | "존재하지 않는 영화입니다" + 뒤로가기       |

### 캐시 정책

- staleTime: 10분
- gcTime: 15분

---

## 2. 컴포넌트 설계

### 2.1 MovieCard 컴포넌트

```typescript
interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

// 기능:
// - 포스터 이미지 표시
// - 영화 제목 (호버 시 표시)
// - 평점 표시
// - 호버 시 확대 + 그림자 효과
// - 클릭 이벤트 처리
```

### 2.2 MovieGrid 컴포넌트

```typescript
interface MovieGridProps {
  movies: Movie[];
  isLoading: boolean;
  error?: Error | null;
  onMovieClick: (id: number) => void;
  columns?: number; // 기본값: 4 (반응형 조정)
}

// 기능:
// - 영화 카드 그리드 렌더링
// - Skeleton Loading 상태
// - 에러 상태 표시
```

### 2.3 SearchBar 컴포넌트

```typescript
interface SearchBarProps {
  onSearch: (query: string) => void;
  defaultValue?: string;
}

// 기능:
// - 검색어 입력
// - Debouncing (300ms)
// - Enter 키 지원
// - 입력창 초기화 버튼 (X)
```

### 2.4 Header 컴포넌트

```typescript
// 기능:
// - 로고 (메인페이지 링크)
// - SearchBar 포함
// - 메인 링크
// - 반응형 모바일 메뉴 (선택)
```

### 2.5 Pagination 컴포넌트

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// 기능:
// - 페이지 번호 버튼
// - 이전/다음 버튼
// - 현재 페이지 하이라이트
// - 비활성 버튼 (첫/마지막 페이지)
```

---

## 3. API 통합 설계

### 3.1 쿼리 구성 (Tanstack Query)

#### 인기 영화

```typescript
// Key: ['movies', 'popular']
// Endpoint: /movie/popular
// Parameters: page
// staleTime: 5분
// retry: 1회
```

#### 상위 평점

```typescript
// Key: ['movies', 'topRated']
// Endpoint: /movie/top_rated
// Parameters: page
// staleTime: 5분
// retry: 1회
```

#### 개봉예정

```typescript
// Key: ['movies', 'upcoming']
// Endpoint: /movie/upcoming
// Parameters: page
// staleTime: 5분
// retry: 1회
```

#### 검색

```typescript
// Key: ['movies', 'search', {query, page}]
// Endpoint: /search/movie
// Parameters: query, page
// staleTime: 3분
// retry: 1회
// enabled: !!query.trim() (쿼리가 없으면 실행 안 함)
```

#### 상세

```typescript
// Key: ['movies', 'detail', id]
// Endpoint: /movie/{id}
// Parameters: id
// staleTime: 10분
// retry: 1회
// enabled: !!id
```

### 3.2 에러 처리

```typescript
// 일반 API 에러
if (!response.ok) {
  throw new Error(`API Error: ${response.status}`);
}

// 쿼리 에러 상태
if (isError) {
  return <ErrorMessage error={error} onRetry={refetch} />;
}
```

---

## 4. 라우팅 구조

```typescript
Routes:
├── / (MainPage)
├── /search (SearchPage)
│   └── ?query={keyword}&page={number}
├── /movie/:id (DetailPage)
└── * (NotFoundPage)
```

---

## 5. 스타일링 전략 (CSS Modules)

### 파일 구조

```
styles/
├── MainPage.module.css
├── SearchPage.module.css
├── DetailPage.module.css
├── components/
│   ├── MovieCard.module.css
│   ├── MovieGrid.module.css
│   ├── SearchBar.module.css
│   ├── Header.module.css
│   └── Pagination.module.css
└── global.css
```

### 주요 스타일 클래스

| 요소      | 클래스            | 설명                    |
| --------- | ----------------- | ----------------------- |
| 카드      | `movieCard`       | 기본 카드 스타일        |
| 카드 호버 | `movieCard:hover` | 확대 + 그림자           |
| 포스터    | `posterImage`     | 이미지 박스 (300x450px) |
| 그리드    | `movieGrid`       | CSS Grid (4열 반응형)   |
| 검색바    | `searchInput`     | 검색 입력 필드          |

---

## 6. 성능 최적화 명세

### 이미지 최적화

- TMDB 이미지 URL 크기: `w500` (카드), `original` (배경)
- WebP 포맷 지원 (브라우저 지원 시)
- Lazy Loading (Intersection Observer)

### 코드 분할

```typescript
const MainPage = lazy(() => import('../pages/MainPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const DetailPage = lazy(() => import('../pages/DetailPage'));
```

### 캐싱 전략

- Tanstack Query: 위의 각 쿼리별 staleTime 참고
- CloudFront:
  - HTML: 5분
  - JS/CSS: 1년 (콘텐츠 해시)
  - 이미지: 1년

---

## 7. 테스트 케이스 (개발 중 검증)

### 메인페이지

- [ ] 3개 섹션 데이터 정상 로드
- [ ] 영화 카드 클릭 시 상세페이지 이동
- [ ] 로딩 상태 표시 정상 작동
- [ ] 에러 발생 시 재시도 버튼 동작

### 검색페이지

- [ ] 검색어 입력 후 결과 표시
- [ ] Debounce 동작 확인 (불필요한 요청 없음)
- [ ] 페이지네이션 정상 작동
- [ ] URL 쿼리 파라미터 동기화
- [ ] 검색 결과 없음 상태 표시

### 상세페이지

- [ ] URL 파라미터로 영화 정보 로드
- [ ] 배경/포스터 이미지 표시
- [ ] 모든 정보 필드 표시
- [ ] 뒤로가기 버튼 동작
- [ ] 존재하지 않는 영화 ID 에러 처리

### 공통

- [ ] 반응형 디자인 (모바일/태블릿/데스크톱)
- [ ] 네트워크 오류 처리
- [ ] 캐시 동작 확인 (개발자 도구)
