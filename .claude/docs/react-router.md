# React Router 규칙

## 라우트 정의 구조

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

## 라우트 구성

- 라우트 설정은 별도 파일로 분리
- Lazy Loading으로 번들 크기 최적화
- 동적 세그먼트는 `:param` 형식
- 404 페이지는 `path: '*'`로 마지막 라우트 설정

## 네비게이션

### useNavigate Hook 사용

```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/path', { replace: false, state: { key: 'value' } });
```

### Link 컴포넌트 사용

```typescript
import { Link } from 'react-router-dom';
<Link to="/detail/123">Go to Detail</Link>
```

## 라우트 파라미터

### useParams Hook

```typescript
import { useParams } from 'react-router-dom';

const { id } = useParams<{ id: string }>();
```

### useSearchParams Hook

```typescript
import { useSearchParams } from 'react-router-dom';

const [searchParams, setSearchParams] = useSearchParams();
const page = searchParams.get('page');

// 검색 파라미터 설정
setSearchParams({ page: '2', sort: 'date' });
```

## 라우트 가드

인증이 필요한 라우트 등은 래퍼 컴포넌트로 구현:

````typescript
const ProtectedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const isAuthenticated = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

## FLAB 프로젝트 라우팅 구조

### 라우트 정의

```typescript
import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const MainPage = lazy(() => import('../pages/MainPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const DetailPage = lazy(() => import('../pages/DetailPage'));
const CollectionDetailPage = lazy(() => import('../pages/CollectionDetailPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/search',
    element: <SearchPage />,
  },
  {
    path: '/movie/:id',
    element: <DetailPage />,
  },
  {
    path: '/collection/:id',
    element: <CollectionDetailPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
````

### 페이지별 라우팅 사용법

#### 메인페이지

```typescript
// 페이지 진입
<Link to="/">홈</Link>

// 카드 클릭 시 상세페이지 이동
const navigate = useNavigate();
navigate(`/movie/${movie.id}`);
```

#### 검색페이지

```typescript
// 검색페이지 이동
const navigate = useNavigate();
navigate(`/search?query=${encodeURIComponent(query)}&page=1`);

// URL 파라미터 추출
const [searchParams] = useSearchParams();
const query = searchParams.get('query');
const page = parseInt(searchParams.get('page') || '1');
```

#### 상세페이지

```typescript
// URL 파라미터 추출
const { id } = useParams<{ id: string }>();

// 뒤로가기
const navigate = useNavigate();
navigate(-1); // 또는 navigate('/');
```

### 쿼리 파라미터 처리

```typescript
// 검색페이지 URL 동기화
const [searchParams, setSearchParams] = useSearchParams();

const handleSearch = (query: string) => {
  setSearchParams({ query, page: '1' });
};

const handlePageChange = (page: number) => {
  setSearchParams({ query: searchParams.get('query') || '', page: page.toString() });
};
```

```

```
