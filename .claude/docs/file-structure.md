# 파일 및 폴더 구조

## 권장 폴더 구조

```
src/
├── pages/              # 페이지 컴포넌트
│   ├── HomePage.tsx
│   ├── DetailPage.tsx
│   └── NotFound.tsx
├── components/         # 재사용 컴포넌트
│   ├── Header/
│   │   ├── Header.tsx
│   │   ├── Header.module.css
│   │   └── index.ts    # re-export
│   ├── Sidebar/
│   │   ├── Sidebar.tsx
│   │   ├── Sidebar.module.css
│   │   └── index.ts
│   └── common/         # 공통 컴포넌트
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Modal.tsx
├── hooks/              # Custom Hooks
│   ├── useUsers.ts
│   ├── useUser.ts
│   ├── useAuth.ts
│   └── useDebounce.ts
├── api/                # API 호출 및 쿼리 설정
│   ├── queries/        # Query Hooks
│   │   ├── users.ts
│   │   ├── posts.ts
│   │   └── index.ts    # re-export
│   ├── mutations/      # Mutation Hooks
│   │   ├── users.ts
│   │   ├── posts.ts
│   │   └── index.ts    # re-export
│   ├── keys.ts         # Query Key Factory
│   ├── client.ts       # QueryClient 설정
│   └── index.ts        # re-export
├── types/              # TypeScript 타입 정의
│   ├── user.ts
│   ├── post.ts
│   ├── api.ts
│   └── index.ts        # re-export
├── routes/             # React Router 설정
│   ├── index.ts        # 라우트 정의
│   └── guards.ts       # 라우트 가드
├── styles/             # 전역 스타일
│   ├── global.css
│   ├── variables.css   # CSS 변수
│   └── reset.css       # CSS 리셋
├── utils/              # 유틸리티 함수
│   ├── format.ts       # 데이터 포맷팅
│   ├── validation.ts   # 유효성 검사
│   ├── date.ts         # 날짜 관련
│   └── index.ts        # re-export
├── constants/          # 상수 값
│   ├── api.ts          # API 관련 상수
│   ├── routes.ts       # 라우트 관련 상수
│   └── index.ts        # re-export
├── assets/             # 정적 자원
│   ├── images/
│   ├── icons/
│   └── fonts/
├── layouts/            # 레이아웃 컴포넌트
│   ├── MainLayout.tsx
│   └── AuthLayout.tsx
├── providers/          # Context Providers
│   ├── AuthProvider.tsx
│   └── ThemeProvider.tsx
├── App.tsx             # 메인 앱 컴포넌트
├── main.tsx            # 진입점
└── index.css           # 글로벌 스타일
```

## 파일 명명 규칙

### 컴포넌트 파일

- **PascalCase**: `UserProfile.tsx`, `Header.tsx`, `Sidebar.tsx`
- 폴더 구성: 컴포넌트 + 관련 스타일 + index.ts

### Hooks 파일

- **usePrefix**: `useUsers.ts`, `useAuth.ts`, `useDebounce.ts`
- hook 파일은 `hooks/` 폴더에 위치

### API 파일

- **소문자**: `users.ts`, `posts.ts`
- 쿼리는 `api/queries/`, 뮤테이션은 `api/mutations/`

### 타입 파일

- **소문자 또는 PascalCase**: `user.ts`, `User.ts`
- 타입은 `types/` 폴더에 위치

## index.ts 파일 활용

각 폴더의 진입점에서 `index.ts`를 사용하여 내보내기:

```typescript
// types/index.ts
export * from './user';
export * from './post';
export * from './api';

// 사용 시
import { User, Post, ApiResponse } from '@/types';
```

## CSS Modules

컴포넌트별로 분리된 CSS Module 사용:

```typescript
// UserProfile.tsx
import styles from './UserProfile.module.css';

export const UserProfile = () => {
  return <div className={styles.container}>...</div>;
};

## FLAB 프로젝트 권장 폴더 구조

```
src/
├── pages/                      # 페이지 컴포넌트
│   ├── MainPage.tsx
│   ├── MainPage.module.css
│   ├── SearchPage.tsx
│   ├── SearchPage.module.css
│   ├── DetailPage.tsx
│   ├── DetailPage.module.css
│   ├── CollectionDetailPage.tsx
│   ├── CollectionDetailPage.module.css
│   └── NotFoundPage.tsx
├── components/                 # 재사용 컴포넌트
│   ├── layout/                # 레이아웃 컴포넌트
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   ├── Header.module.css
│   │   │   └── index.ts
│   │   ├── Footer/
│   │   │   ├── Footer.tsx
│   │   │   ├── Footer.module.css
│   │   │   └── index.ts
│   │   └── MainLayout.tsx
│   ├── movie/                 # 영화 관련 컴포넌트
│   │   ├── MovieCard.tsx
│   │   ├── MovieCard.module.css
│   │   ├── MovieGrid.tsx
│   │   ├── MovieGrid.module.css
│   │   └── index.ts
│   ├── carousel/              # 캐러셀 컴포넌트
│   │   ├── CarouselRow.tsx
│   │   ├── CarouselRow.module.css
│   │   ├── CollectionCard.tsx
│   │   ├── CollectionCard.module.css
│   │   ├── ArtistCard.tsx
│   │   ├── ArtistCard.module.css
│   │   └── index.ts
│   ├── search/                # 검색 관련 컴포넌트
│   │   ├── SearchBar.tsx
│   │   ├── SearchBar.module.css
│   │   ├── Pagination.tsx
│   │   ├── Pagination.module.css
│   │   └── index.ts
│   └── common/                # 공통 컴포넌트
│       ├── Button.tsx
│       ├── Button.module.css
│       ├── LoadingSpinner.tsx
│       ├── LoadingSpinner.module.css
│       ├── ErrorMessage.tsx
│       ├── ErrorMessage.module.css
│       └── index.ts
├── hooks/                     # Custom Hooks
│   ├── tmdb/                  # TMDB 관련 Hooks
│   │   ├── useConfiguration.ts
│   │   ├── useGenres.ts
│   │   ├── usePopularMovies.ts
│   │   ├── useDiscoverMovies.ts
│   │   ├── useCollectionDetail.ts
│   │   ├── usePopularPersons.ts
│   │   ├── usePersonCredits.ts
│   │   ├── useSearchMovies.ts
│   │   ├── useMovieDetail.ts
│   │   └── index.ts
│   └── common/                # 공통 Hooks
│       ├── useDebouncedValue.ts
│       ├── useIntersectionObserver.ts
│       └── index.ts
├── api/                       # API 호출 및 쿼리 설정
│   ├── tmdb/                  # TMDB API
│   │   ├── client.ts          # API 클라이언트
│   │   ├── endpoints.ts       # 엔드포인트 상수
│   │   ├── queries.ts         # 쿼리 함수
│   │   └── index.ts
│   ├── keys/                  # Query Key Factory
│   │   ├── tmdbKeys.ts
│   │   └── index.ts
│   ├── queries/               # React Query Hooks
│   │   ├── tmdbQueries.ts
│   │   └── index.ts
│   └── index.ts
├── types/                     # TypeScript 타입 정의
│   ├── tmdb.ts                # TMDB API 타입
│   ├── movie.ts               # 영화 관련 타입
│   ├── collection.ts          # 컬렉션 관련 타입
│   ├── person.ts              # 인물 관련 타입
│   └── index.ts
├── utils/                     # 유틸리티 함수
│   ├── format.ts              # 데이터 포맷팅
│   ├── image.ts               # 이미지 관련 유틸리티
│   ├── validation.ts          # 유효성 검사
│   ├── error.ts               # 에러 처리 유틸리티
│   └── index.ts
├── constants/                 # 상수 값
│   ├── tmdb.ts                # TMDB 관련 상수
│   ├── cache.ts               # 캐시 관련 상수
│   ├── image.ts               # 이미지 크기 상수
│   └── index.ts
├── styles/                    # 전역 스타일
│   ├── global.css
│   ├── variables.css          # CSS 변수
│   └── reset.css              # CSS 리셋
├── routes/                    # React Router 설정
│   ├── index.ts               # 라우트 정의
│   └── lazyRoutes.ts          # Lazy Loading 라우트
├── providers/                 # Context Providers
│   ├── QueryProvider.tsx
│   ├── RouterProvider.tsx
│   └── index.ts
├── assets/                    # 정적 자원
│   ├── images/
│   │   ├── placeholder.png
│   │   └── logo.svg
│   ├── icons/
│   └── fonts/
├── App.tsx                    # 메인 앱 컴포넌트
├── main.tsx                   # 진입점
└── index.css                  # 글로벌 스타일
```

## TMDB API 폴더 구조

```
api/
├── tmdb/
│   ├── client.ts              # TMDB API 클라이언트
│   ├── endpoints.ts           # 엔드포인트 정의
│   ├── types.ts               # TMDB API 타입
│   └── index.ts
├── keys/
│   ├── tmdbKeys.ts            # TMDB Query Keys
│   └── index.ts
├── queries/
│   ├── configuration.ts       # 설정 관련 쿼리
│   ├── movies.ts             # 영화 관련 쿼리
│   ├── collections.ts        # 컬렉션 관련 쿼리
│   ├── persons.ts           # 인물 관련 쿼리
│   └── index.ts
└── index.ts
```

## 컴포넌트별 파일 구조

### 페이지 컴포넌트
```
pages/
├── MainPage.tsx              # 메인페이지
├── MainPage.module.css       # 메인페이지 스타일
├── SearchPage.tsx           # 검색페이지
├── SearchPage.module.css    # 검색페이지 스타일
├── DetailPage.tsx           # 상세페이지
├── DetailPage.module.css    # 상세페이지 스타일
└── NotFoundPage.tsx         # 404 페이지
```

### 캐러셀 컴포넌트
```
components/carousel/
├── CarouselRow.tsx          # 캐러셀 레이아웃
├── CarouselRow.module.css   # 캐러셀 스타일
├── MovieCard.tsx            # 영화 카드
├── MovieCard.module.css     # 영화 카드 스타일
├── CollectionCard.tsx       # 컬렉션 카드
├── CollectionCard.module.css # 컬렉션 카드 스타일
├── ArtistCard.tsx           # 인물 카드
├── ArtistCard.module.css    # 인물 카드 스타일
└── index.ts                # re-export
```

## Hooks 폴더 구조

```
hooks/
├── tmdb/                    # TMDB API Hooks
│   ├── useConfiguration.ts  # TMDB 설정 가져오기
│   ├── useGenres.ts         # 장르 목록 가져오기
│   ├── usePopularMovies.ts  # 인기 영화 가져오기
│   ├── useDiscoverMovies.ts # 영화 탐색
│   ├── useCollectionDetail.ts # 컬렉션 상세
│   ├── usePopularPersons.ts # 인기 인물 목록
│   ├── usePersonCredits.ts  # 인물 출연작
│   ├── useSearchMovies.ts   # 영화 검색
│   ├── useMovieDetail.ts    # 영화 상세
│   └── index.ts
└── common/                  # 공통 Hooks
    ├── useDebouncedValue.ts # 디바운싱
    ├── useIntersectionObserver.ts # Intersection Observer
    └── index.ts
```

## 스타일 폴더 구조

```
styles/
├── global.css               # 글로벌 스타일
├── variables.css            # CSS 변수 (색상, 폰트 등)
├── reset.css                # CSS 리셋
└── themes/                  # 테마별 스타일 (선택)
    └── watcha.css           # Watcha 테마
```

## FLAB 프로젝트 파일 명명 규칙

### 페이지 파일
- `MainPage.tsx` - 메인페이지
- `SearchPage.tsx` - 검색페이지
- `DetailPage.tsx` - 상세페이지
- `CollectionDetailPage.tsx` - 컬렉션 상세페이지

### 컴포넌트 파일
- `MovieCard.tsx` - 영화 카드
- `CarouselRow.tsx` - 캐러셀 레이아웃
- `SearchBar.tsx` - 검색바

### Hooks 파일
- `useConfiguration.ts` - 설정 Hook
- `usePopularMovies.ts` - 인기 영화 Hook
- `useDebouncedValue.ts` - 디바운싱 Hook

### API 파일
- `tmdbQueries.ts` - TMDB 쿼리
- `tmdbKeys.ts` - TMDB Query Keys

### 타입 파일
- `tmdb.ts` - TMDB API 타입
- `movie.ts` - 영화 타입
- `collection.ts` - 컬렉션 타입
- `person.ts` - 인물 타입
```
