# Tanstack Query 규칙

## 쿼리 설정

### Query Key Factory Pattern

```typescript
// ✅ 권장: 계층적 쿼리 키 구조
const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};
```

## Query Hook 작성

### 리스트 데이터 쿼리

```typescript
// ✅ 권장: 타입 안전성과 재사용성
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export const useUsers = (filters?: UserFilters) => {
  return useQuery({
    queryKey: userKeys.list(filters || {}),
    queryFn: async () => {
      const response = await fetch(`/api/users?${new URLSearchParams(filters)}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json() as Promise<User[]>;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (구 cacheTime)
  });
};
```

### 단일 데이터 쿼리

```typescript
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json() as Promise<User>;
    },
    enabled: !!id, // id가 있을 때만 쿼리 실행
  });
};
```

## Mutation 작성

### 기본 Mutation 패턴

```typescript
// ✅ 권장: Mutation Hook
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUser: Omit<User, 'id'>) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error('Failed to create user');
      return response.json() as Promise<User>;
    },
    onSuccess: (newUser) => {
      // 전체 사용자 목록 invalidate
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      // 또는 기존 데이터에 추가
      queryClient.setQueryData(
        userKeys.lists(),
        (old: User[] | undefined) => (old ? [...old, newUser] : [newUser])
      );
    },
  });
};
```

## Query Provider 설정

```typescript
// ✅ 권장: App.tsx 또는 main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리프레시 비활성화
    },
    mutations: {
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

## 쿼리 캐싱 전략

### Prefetching

```typescript
const prefetchUsers = () => {
  queryClient.prefetchQuery({
    queryKey: userKeys.lists(),
    queryFn: fetchUsers,
  });
};
```

### 초기 데이터 설정

```typescript
useQuery({
  queryKey: userKeys.lists(),
  queryFn: fetchUsers,
  initialData: initialUsers, // 초기 데이터 제공으로 로딩 상태 방지
});
```

## 에러 처리

### 글로벌 에러 핸들러

```typescript
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.error('Global query error:', error);
      // 글로벌 에러 처리 로직
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error('Global mutation error:', error);
    },
  }),
});

## FLAB 프로젝트 캐시 정책

### TMDB API 쿼리 설정

```typescript
// 공통 설정/사전
const tmdbQueryConfig = {
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

### Query Key 패턴

```typescript
// TMDB Query Keys
const tmdbKeys = {
  all: ['tmdb'] as const,
  configuration: () => [...tmdbKeys.all, 'configuration'] as const,
  genres: () => [...tmdbKeys.all, 'genres'] as const,
  
  movies: () => [...tmdbKeys.all, 'movies'] as const,
  moviesList: () => [...tmdbKeys.movies(), 'list'] as const,
  moviesDetail: (id: number) => [...tmdbKeys.movies(), 'detail', id] as const,
  moviesSearch: (query: string, page: number) => [...tmdbKeys.movies(), 'search', { query, page }] as const,
  
  collections: () => [...tmdbKeys.all, 'collections'] as const,
  collectionsDetail: (id: number) => [...tmdbKeys.collections(), 'detail', id] as const,
  
  persons: () => [...tmdbKeys.all, 'persons'] as const,
  personsCredits: (id: number) => [...tmdbKeys.persons(), 'credits', id] as const,
};
```
```
