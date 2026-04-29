# 기능별 상세 명세

## 메인 페이지 (MainPage)

### 화면 구조

```
┌─────────────────────────────────────┐
│ Header (로고, 네비게이션, 검색 버튼)      │
├─────────────────────────────────────┤
│ 히어로 캐러셀 (Landscape 1개)           │
│ ┌───────────────────────────────┐   │
│ │ 배경 이미지 + 설명 + CTA + 1|N │   │
│ └───────────────────────────────┘   │
├─────────────────────────────────────┤
│ 랜덤 컬렉션 캐러셀 (Landscape 동시 노출 1~3개) │
├─────────────────────────────────────┤
│ 랜덤 장르 캐러셀 x3 (Portrait 동시 노출 1~8개) │
├─────────────────────────────────────┤
│ 인기 추천 캐러셀 x2                    │
├─────────────────────────────────────┤
│ 랜덤 테마 캐러셀 (최대 15개)            │
├─────────────────────────────────────┤
│ 왓챠 TOP 20 캐러셀 (1회)               │
├─────────────────────────────────────┤
│ 아티스트 캐러셀 (1회)                   │
├─────────────────────────────────────┤
│ Footer (정책/고객센터/회사정보/SNS)     │
└─────────────────────────────────────┘
```

### 섹션 구성 규칙

#### 히어로 캐러셀
- **노출 개수**: 1개 (Landscape)
- **구성**:
  - 배경: 컨텐츠 이미지로 꽉 채움
  - 좌측 하단: 설명 + CTA 버튼 (감상하기/컬렉션 보기)
  - 우측 하단: 현재 순서 표시 (ex. 1|11 or 3|11)
- **동작**: CTA 클릭 시 상세페이지로 이동

#### 랜덤 컬렉션 캐러셀
- **노출 개수**: 뷰포트 너비에 따라 동시 노출 1~3개 (Landscape)
- **구성**:
  - 상단: 컬렉션명 + 컬렉션 설명
  - 하단: 컨텐츠 이미지
- **동작**: 클릭 시 컬렉션 상세페이지로 이동

#### 랜덤 장르 캐러셀
- **노출 개수**: 정확히 3개 섹션
- **카드 개수**: 뷰포트 너비에 따라 동시 노출 1~8개 (Portrait)
- **구성**:
  - 헤드라인: 장르 설명 한줄
  - 컨텐츠: 이미지만 출력
- **동작**: 카드 클릭 시 영화 상세페이지로 이동

#### 인기 추천 캐러셀
- **노출 개수**: 2종류 (장르/태그 각 1개)
- **카드 개수**: 뷰포트 너비에 따라 동시 노출 1~3개 (Landscape)
- **구성**:
  - 헤드라인: "인기 추천 장르" 또는 "인기 추천 태그"
  - 좌측 상단: 장르/태그 이름 (흰 텍스트)
  - 배경: 랜덤 색상/패턴
- **동작**: 각 타입당 한번만 등장

#### 랜덤 테마 캐러셀
- **노출 개수**: 최대 15개 섹션
- **카드 개수**: 뷰포트 너비에 따라 동시 노출 1~8개 (Portrait)
- **구성**:
  - 헤드라인: 테마 설명 한줄
  - 컨텐츠: 이미지만 출력
- **동작**: 카드 클릭 시 영화 상세페이지로 이동

#### TOP 20 캐러셀
- **노출 개수**: 1개 섹션
- **카드 개수**: 뷰포트 너비에 따라 동시 노출 1~7개 (Portrait)
- **구성**:
  - 헤드라인: "왓챠 TOP 20"
  - 이미지: 좌우 공백 + 가운데 컨텐츠 이미지
  - 좌측 하단: 인기 순위 숫자 오버레이
- **동작**: 단 한번만 등장, 카드 클릭 시 영화 상세페이지로 이동

#### 아티스트 캐러셀
- **노출 개수**: 1개 섹션
- **카드 개수**: 뷰포트 너비에 따라 동시 노출 1~8개 (Portrait)
- **구성**:
  - 헤드라인: "아티스트"
  - 상단: 원형 아티스트 이미지
  - 중단: 아티스트 이름 한줄
  - 하단: 최신 출연작 한줄
- **동작**: 단 한번만 등장

### 데이터 흐름

```typescript
MainPage
├── useTMDBConfiguration() → imageConfig
├── useMovieGenres() → genreMap
├── usePopularMovies() → popularPool
├── useDiscoverMovies(filters) → genre/theme pools
├── useCollectionCandidates() → collectionIds
├── useCollectionDetail(collectionId) → collection cards
├── usePopularPersons() → artist list
└── usePersonMovieCredits(personId) → latest credit line
```

### 로딩 및 에러 상태

- **로딩**: 타입별 Skeleton Loading
- **에러**: 섹션 단위 fallback UI + 재시도 버튼

---

## 검색 페이지 (SearchPage)

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
│ │ 🎬  │ │ 🎬  │ │ 🎬  │ │ 🎬  │... │
│ └─────┘ └─────┘ └─────┘ └─────┘    │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │
│ │ 🎬  │ │ 🎬  │ │ 🎬  │ │ 🎬  │    │
│ └─────┘ └─────┘ └─────┘ └─────┘    │
├─────────────────────────────────────┤
│ [◀ 이전] [1] [2] [3] ... [다음 ▶]    │
└─────────────────────────────────────┘
```

### 데이터 흐름

```typescript
SearchPage
├── useSearchParams() → query, page 추출
├── useSearchMovies(query, page) → results
└── Render MovieGrid + Pagination
```

### 상호작용

| 사용자 액션 | 시스템 반응 |
|-----------|-----------|
| 검색바 입력 | Debounce (300ms) 후 API 호출 |
| Enter 키 | 즉시 검색 |
| 검색 결과 카드 클릭 | `/movie/{id}` 라우팅 |
| 페이지 번호 클릭 | URL 업데이트 + 결과 조회 |
| 뒤로/앞으로 버튼 클릭 | 페이지 이동 |

### 특수 상태

| 상태 | 표시 내용 |
|------|----------|
| 초기 로드 | 빈 상태 또는 인기 검색어 |
| 검색 중 | Skeleton Loading |
| 결과 없음 | "검색 결과가 없습니다" 메시지 |
| 에러 발생 | 재시도 버튼 + 에러 메시지 |

---

## 상세 페이지 (DetailPage)

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

```typescript
DetailPage
├── useParams() → id 추출
├── useMovieDetail(id) → movieDetail
└── Render detail layout
```

### 상호작용

| 사용자 액션 | 시스템 반응 |
|-----------|-----------|
| 페이지 진입 | 영화 ID 기반 상세정보 API 호출 |
| 배경/포스터 로딩 중 | 플레이스홀더 표시 |
| 뒤로가기 클릭 | 이전 페이지로 이동 |
| 브라우저 뒤로가기 | 이전 페이지로 이동 (히스토리 유지) |

### 특수 상태

| 상태 | 표시 내용 |
|------|----------|
| 로딩 중 | Skeleton Loading (레이아웃만) |
| 데이터 로드 완료 | 전체 정보 표시 |
| 에러 발생 | "영화 정보를 불러올 수 없습니다" + 뒤로가기 |
| 영화 없음 (404) | "존재하지 않는 영화입니다" + 뒤로가기 |

---

## 컴포넌트 설계

### MovieCard 컴포넌트

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

### CarouselRow 컴포넌트

```typescript
interface CarouselRowProps<TItem> {
  title: string;
  description?: string;
  items: TItem[];
  cardType: 'hero' | 'landscape' | 'portrait' | 'artist' | 'ranked';
  isLoading: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

// 기능:
// - 가로 스크롤/스와이프 가능한 캐러셀 렌더링
// - 카드 타입별 렌더링 전략 분기
// - Skeleton Loading 및 에러 fallback 처리
```

### CollectionCard / ArtistCard 컴포넌트

```typescript
interface CollectionCardProps {
  collection: {
    id: number;
    name: string;
    overview: string;
    posterPath?: string;
    backdropPath?: string;
  };
  onClick: (id: number) => void;
}

interface ArtistCardProps {
  person: {
    id: number;
    name: string;
    profilePath?: string;
    latestMovieTitle?: string;
  };
  onClick?: (id: number) => void;
}
```

### SearchBar 컴포넌트

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

### Header 컴포넌트

```typescript
// 기능:
// - 로고 (메인페이지 링크)
// - SearchBar 포함
// - 메인 링크
// - 반응형 모바일 메뉴 (선택)
```

### Pagination 컴포넌트

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

## 라우팅 구조

```typescript
Routes:
├── / (MainPage)
├── /search (SearchPage)
│   └── ?query={keyword}&page={number}
├── /movie/:id (DetailPage)
├── /collection/:id (CollectionDetailPage, 선택)
└── * (NotFoundPage)
```

---

## 에이전트 개발 시 주의사항

1. **섹션 구성 규칙**: 메인페이지 섹션 등장 규칙 정확히 준수
2. **반응형 레이아웃**: 뷰포트 너비에 따른 동시 노출 개수 범위 준수
3. **데이터 흐름**: 권장 호출 순서 준수
4. **로딩 상태**: 타입별 Skeleton Loading 적용
5. **에러 처리**: 섹션 단위 fallback UI 제공
6. **캐시 정책**: 각 페이지별 캐시 정책 준수