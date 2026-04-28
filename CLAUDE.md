# FLAB Project - Development Guidelines

## 프로젝트 개요

- **프레임워크**: React 19.2.5 + TypeScript 6.0.3
- **번들러**: Webpack 5
- **라우팅**: React Router 7.14.2
- **상태관리**: Tanstack Query 5.100.3
- **스타일링**: CSS Modules (예정)
- **코드 품질**: ESLint 9 (Flat Config) + Prettier + Husky + lint-staged

## 환경 설정

### TypeScript 규칙

- **Strict Mode**: 활성화 (모든 TypeScript 규칙 준수)
- **JSX**: react-jsx (React import 불필요)
- **Module**: esnext
- **Target**: es5
- **주요 옵션**:
  - `noUncheckedIndexedAccess`: true
  - `exactOptionalPropertyTypes`: true
  - `verbatimModuleSyntax`: true
  - `isolatedModules`: true

### Prettier 설정

```javascript
printWidth: 120,
tabWidth: 2,
singleQuote: true,
trailingComma: 'all',
semi: true,
```

### ESLint 규칙

- JavaScript & TypeScript 기본 권장 규칙 활성화
- React 권장 규칙 활성화 (`eslint-plugin-react`)
- `react/react-in-jsx-scope`: off (auto JSX runtime)
- `react/prop-types`: off (TypeScript로 타입 검증)
- `no-unused-vars`: error

### Husky + lint-staged 설정

**Husky**: Git hooks를 통해 commit 전 자동으로 린트/포맷팅 실행
**lint-staged**: 스테이징된 파일(`git add`)만 선택적으로 검사

```bash
# Pre-commit Hook 자동 실행
# 1. Prettier로 코드 포맷팅
# 2. ESLint --fix로 자동 수정 가능한 문제 해결
# 3. 통과하면 commit 진행, 실패하면 commit 차단
```

**대상 파일**: `*.{js,jsx,ts,tsx,css}`

## React 코딩 규칙

### 컴포넌트 구조

```typescript
// ✅ 권장: FC 문법과 명시적 타입
interface ComponentProps {
  title: string;
  onAction?: (value: string) => void;
}

export const MyComponent: React.FC<ComponentProps> = ({ title, onAction }) => {
  return <div>{title}</div>;
};
```

### Props 타입 정의

- 모든 Props는 `interface` 또는 `type`으로 정의
- Props 이름: `{ComponentName}Props`
- Optional props는 `?` 사용
- 콜백 함수는 `(arg: Type) => ReturnType` 형식

### Hooks 사용

- `useCallback`, `useMemo` 필수 의존성 배열 완성
- `useEffect` 효과 정리(cleanup) 함수 제공 (필요시)
- Custom hooks는 `use` prefix 사용
- Hook 호출은 컴포넌트 최상위에서만 수행

### 성능 최적화

- Lazy Loading 활용: `React.lazy()` + `Suspense`
- 코드 분할 주석: `/* webpackChunkName: "chunk-name" */`
- Preload/Prefetch 활용: `/* webpackPreload: true */`, `/* webpackPrefetch: true */`

## React Router 규칙

### 라우트 정의 구조

```typescript
// ✅ 권장: 라우트 설정 파일 분리
// routes/index.ts
import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const HomePage = lazy(() => import('../pages/HomePage'));
const DetailPage = lazy(() => import('../pages/DetailPage'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/detail/:id',
    element: <DetailPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
```

### 라우트 구성

- 라우트 설정은 별도 파일로 분리
- Lazy Loading으로 번들 크기 최적화
- 동적 세그먼트는 `:param` 형식
- 404 페이지는 `path: '*'`로 마지막 라우트 설정

### 네비게이션

```typescript
// ✅ 권장: useNavigate Hook 사용
const navigate = useNavigate();
navigate('/path', { replace: false, state: { key: 'value' } });

// ✅ 권장: Link 컴포넌트
import { Link } from 'react-router-dom';
<Link to="/detail/123">Go to Detail</Link>
```

### 라우트 파라미터

```typescript
// ✅ 권장: useParams Hook
const { id } = useParams<{ id: string }>();

// ✅ 권장: useSearchParams Hook
const [searchParams] = useSearchParams();
const page = searchParams.get('page');
```

## Tanstack Query 규칙

### 쿼리 설정

```typescript
// ✅ 권장: Query Key Factory Pattern
const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};
```

### Query Hook 작성

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

### Mutation 작성

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
      queryClient.setQueryData(userKeys.lists(), (old: User[] | undefined) => (old ? [...old, newUser] : [newUser]));
    },
  });
};
```

### Query Provider 설정

```typescript
// ✅ 권장: App.tsx 또는 main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분
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

## 파일 및 폴더 구조 (권장)

```
src/
├── pages/              # 페이지 컴포넌트
│   ├── HomePage.tsx
│   ├── DetailPage.tsx
│   └── NotFound.tsx
├── components/         # 재사용 컴포넌트
│   ├── Header/
│   │   └── Header.tsx
│   ├── Sidebar/
│   │   └── Sidebar.tsx
│   └── ...
├── hooks/              # Custom Hooks
│   ├── useUsers.ts
│   ├── useUser.ts
│   └── ...
├── api/                # API 호출 및 쿼리 설정
│   ├── queries/
│   │   ├── users.ts
│   │   └── ...
│   ├── mutations/
│   │   ├── users.ts
│   │   └── ...
│   ├── keys.ts         # Query Key Factory
│   └── client.ts       # QueryClient 설정
├── types/              # TypeScript 타입 정의
│   ├── user.ts
│   ├── api.ts
│   └── ...
├── routes/             # React Router 설정
│   └── index.ts
├── styles/             # 전역 스타일
│   └── global.css
├── utils/              # 유틸리티 함수
│   ├── format.ts
│   └── ...
├── App.tsx
├── main.tsx
└── index.css
```

## 에러 처리

### API 에러

```typescript
// ✅ 권장: 타입 안전성
type ApiError = {
  status: number;
  message: string;
  code: string;
};

// Query에서
try {
  const response = await fetch(url);
  if (!response.ok) {
    const error = (await response.json()) as ApiError;
    throw error;
  }
  return response.json();
} catch (error) {
  // Error 처리
}
```

## 빌드 & 성능

### Webpack 최적화

- Tree Shaking 활용
- 코드 분할로 초기 로드 최소화
- 번들 분석: `npm run build:staging` 후 `webpack-bundle-analyzer` 확인

## 개발 스크립트

```bash
# 개발 서버 시작 (HMR 활성화)
npm start

# TypeScript 타입 검사
npm run type-check

# 스테이징 빌드
npm run build:staging

# 프로덕션 빌드 (번들 분석 포함)
npm run build:production

# 린트 (ESLint)
npm run lint

# 린트 (ESLint) 자동 수정
npm run lint:fix

# 포맷팅 (Prettier)
npm run format

# 포맷팅 (Prettier) 확인만
npm run format:check
```

## 중요한 팁

1. **자동 Import**: TypeScript는 자동으로 import를 생성하지 않으므로 명시적으로 작성
2. **Props Drilling**: 깊은 컴포넌트 트리에서는 Context 또는 Tanstack Query 활용
3. **메모리 누수**: `useEffect` cleanup 함수에서 구독/이벤트 리스너 정리
4. **쿼리 의존성**: Tanstack Query 쿼리 키를 일관되게 사용하여 동기화 유지
5. **성능 디버깅**: React DevTools Profiler와 Webpack Bundle Analyzer 활용
