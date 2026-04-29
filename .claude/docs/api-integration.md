# API 통합 가이드

## TMDB API 개요

이 프로젝트는 TMDB(The Movie Database) API v3를 사용하여 영화 정보를 제공합니다.

### 기본 설정

- **Endpoint**: `https://api.themoviedb.org/3`
- **인증**: `api_key` 쿼리 파라미터
- **API 명세**: https://developer.themoviedb.org/openapi/tmdb-api.json

---

## 필수 API 엔드포인트

### 공통 설정

| 엔드포인트 | 용도 | 캐시 정책 |
|-----------|------|----------|
| `/configuration` | 이미지 base_url, poster/backdrop/profile 사이즈 조합 | 1일 |
| `/genre/movie/list` | 장르 ID-이름 매핑, 랜덤 장르 선택 기준 데이터 | 1일 |

### 영화 데이터

| 엔드포인트 | 용도 | 캐시 정책 |
|-----------|------|----------|
| `/discover/movie` | 랜덤 장르/테마 캐러셀 영화 풀 생성 | 5분 |
| `/movie/popular` | 인기순 영화 풀 및 TOP 20 원천 데이터 | 5분 |
| `/search/movie` | 영화 검색 (검색페이지) | 3분 |
| `/movie/{id}` | 영화 상세 정보 (상세페이지) | 10분 |

### 컬렉션 데이터

| 엔드포인트 | 용도 | 캐시 정책 |
|-----------|------|----------|
| `/search/collection` | 컬렉션 후보 ID 수집 | 5분 |
| `/collection/{collection_id}` | 컬렉션 카드 상세 데이터 | 5분 |

### 인물 데이터

| 엔드포인트 | 용도 | 캐시 정책 |
|-----------|------|----------|
| `/person/popular` | 메인 인기 인물 목록 수집 | 5분 |
| `/person/{person_id}/movie_credits` | 아티스트 최신 출연작 정보 | 10분 |

### 조건부 API

| 엔드포인트 | 사용 조건 | 비고 |
|-----------|----------|------|
| `/trending/movie/{time_window}` | 히어로 캐러셀을 트렌드 기반으로 구성할 때 | `movie/day` 또는 `movie/week` |
| `/search/keyword` | 인기 추천 태그 캐러셀을 키워드 기반으로 묶을 때 | 태그 텍스트 품질 향상용 |
| `/movie/{movie_id}` | 개별 영화의 상세 설명을 정확히 노출할 때 | 호출 수 증가에 유의 |
| `/movie/{movie_id}/credits` | 특정 영화 기준 출연진을 역으로 구성할 때 | `person/movie_credits` 대체 가능 |

---

## 데이터 구조 및 타입 정의

### 영화 목록 항목

```typescript
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}
```

### 영화 상세 정보

```typescript
interface MovieDetail extends Movie {
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  tagline: string;
  production_companies: Array<{ name: string }>;
}
```

### 컬렉션 정보

```typescript
interface Collection {
  id: number;
  name: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  parts: Movie[];
}
```

### 인물 정보

```typescript
interface Person {
  id: number;
  name: string;
  profile_path?: string;
  known_for_department?: string;
}

interface PersonCredits {
  cast: Movie[];
  crew: Movie[];
}
```

### 장르 정보

```typescript
interface Genre {
  id: number;
  name: string;
}

interface GenreMap {
  [id: number]: string;
}
```

---

## 캐시 정책

### Tanstack Query 캐시 설정

```typescript
// 공통 설정/사전
const commonQueryConfig = {
  staleTime: 1000 * 60 * 60 * 24, // 1일
  retry: 1,
};

// 메인 피드
const mainFeedQueryConfig = {
  staleTime: 1000 * 60 * 5, // 5분
  retry: 1,
};

// 아티스트 출연작
const artistCreditsQueryConfig = {
  staleTime: 1000 * 60 * 10, // 10분
  retry: 1,
};

// 검색 결과
const searchQueryConfig = {
  staleTime: 1000 * 60 * 3, // 3분
  retry: 1,
};

// 상세페이지
const detailQueryConfig = {
  staleTime: 1000 * 60 * 10, // 10분
  retry: 1,
};
```

---

## 호출 순서 최적화

### 메인페이지 권장 호출 순서

1. **선호출** (초기 1회)
   - `/configuration`
   - `/genre/movie/list`

2. **병렬 호출** (영화 풀 확보)
   - `/movie/popular`
   - `/discover/movie` (장르/테마용)

3. **순차 호출** (컬렉션 구성)
   - `/search/collection` → `/collection/{collection_id}`

4. **순차 호출** (아티스트 구성)
   - `/person/popular` → `/person/{person_id}/movie_credits`

5. **히어로용**
   - `/trending/movie/{time_window}` 또는 인기 영화 풀에서 랜덤 추출

### 호출 순서 규칙

- 공통 설정/장르 사전은 항상 먼저 호출
- 영화 풀 확보는 병렬 호출로 시간 단축
- 컬렉션/아티스트는 순차 호출로 데이터 정확성 확보
- 검색 쿼리는 디바운싱(300ms) 적용
- 상세페이지 쿼리는 ID 기반 조건부 실행

---

## 에러 처리

### 기본 에러 처리

```typescript
if (!response.ok) {
  throw new Error(`API Error: ${response.status}`);
}
```

### 쿼리 에러 상태 처리

```typescript
if (isError) {
  return <ErrorMessage error={error} onRetry={refetch} />;
}
```

### 재시도 정책

- 모든 쿼리: 최대 1회 재시도
- 네트워크 오류: 사용자 친화적 메시지 표시
- 이미지 로딩 실패: 플레이스홀더 표시

---

## 이미지 URL 구성

### TMDB 이미지 크기 표준

- **카드용**: `w500`
- **배경용**: `original`
- **프로필용**: `w185` 또는 `h632`
- **포맷**: WebP 지원 브라우저에서 우선 사용

### 이미지 URL 생성 예시

```typescript
const getImageUrl = (path: string, size: string = 'w500'): string => {
  const baseUrl = configuration.images.secure_base_url;
  return `${baseUrl}${size}${path}`;
};
```

---

## 성능 최적화

### 호출 최적화

- **Debouncing**: 검색 입력 300ms 디바운싱
- **Lazy Loading**: Intersection Observer 적용
- **코드 분할**: 페이지별 라우트 기반 분할

### 캐시 최적화

- **Tanstack Query**: 위의 캐시 정책 준수
- **CloudFront**:
  - HTML: 5분
  - JS/CSS: 1년 (콘텐츠 해시)
  - 이미지: 1년

---

## 에이전트 개발 시 주의사항

1. **API 키 관리**: 항상 환경변수로 관리
2. **캐시 정책 준수**: 각 쿼리별 staleTime/gcTime 설정
3. **에러 처리**: 모든 API 호출에 적절한 에러 처리
4. **이미지 최적화**: 적절한 이미지 크기 사용
5. **호출 순서**: 권장 호출 순서 준수하여 성능 최적화
6. **타입 정의**: 모든 API 응답에 TypeScript 타입 정의