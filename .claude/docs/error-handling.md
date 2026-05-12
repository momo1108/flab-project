# 에러 처리

## API 에러 처리

### 타입 정의

```typescript
// ✅ 권장: 타입 안전성
type ApiError = {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: ApiError;
};
```

### Query에서의 에러 처리

```typescript
export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: async () => {
      const response = await fetch('/api/users');

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw error;
      }

      return response.json() as Promise<User[]>;
    },
    retry: (failureCount, error) => {
      // 404 에러는 재시도하지 않음
      if (error.status === 404) return false;
      // 최대 2번까지만 재시도
      return failureCount < 2;
    },
  });
};
```

### Mutation에서의 에러 처리

```typescript
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (newUser: Omit<User, 'id'>) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw error;
      }

      return response.json() as Promise<User>;
    },
    onSuccess: (data) => {
      toast.success('사용자가 생성되었습니다.');
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: ApiError) => {
      toast.error(`사용자 생성 실패: ${error.message}`);
    },
  });
};
```

## 컴포넌트에서의 에러 처리

### Error Boundary

```typescript
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

### Query Error 표시

```typescript
export const UserList = () => {
  const { data, error, isLoading } = useUsers();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return <ul>{data?.map((user) => <UserItem key={user.id} user={user} />)}</ul>;
};
```

## 네트워크 에러 처리

```typescript
const isNetworkError = (error: unknown): boolean => {
  return error instanceof TypeError && error.message.includes('Failed to fetch');
};

const handleApiError = (error: unknown) => {
  if (isNetworkError(error)) {
    toast.error('네트워크 연결을 확인해주세요.');
  } else if (error instanceof Error) {
    toast.error(error.message);
  }
};
```

## 글로벌 에러 핸들러

````typescript
// utils/errorHandler.ts
export const globalErrorHandler = (error: unknown) => {
  console.error('Global error:', error);

  if (error instanceof Error) {
    // 에러 추적 서비스에 전송
    // trackError(error);

    // 사용자에게 알림
    toast.error('문제가 발생했습니다. 다시 시도해주세요.');
  }
};

// main.tsx
window.addEventListener('error', globalErrorHandler);
window.addEventListener('unhandledrejection', globalErrorHandler);

## FLAB 프로젝트 에러 처리

### TMDB API 에러 타입 정의

```typescript
// TMDB API 에러 타입
interface TmdbError {
  status_code: number;
  status_message: string;
  success: false;
}

// 애플리케이션 에러 타입
interface AppError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// 통합 에러 처리 타입
type ErrorResponse = TmdbError | AppError;
````

### TMDB API 에러 처리

```typescript
// API 요청 래퍼
const tmdbFetch = async <T>(endpoint: string): Promise<T> => {
  const apiKey = import.meta.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = (await response.json()) as TmdbError;

    switch (response.status) {
      case 401:
        throw new Error('API 인증 실패: API Key를 확인해주세요.');
      case 404:
        throw new Error('요청한 리소스를 찾을 수 없습니다.');
      case 429:
        throw new Error('API 요청 한도 초과: 잠시 후 다시 시도해주세요.');
      case 500:
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      default:
        throw new Error(error.status_message || '알 수 없는 오류가 발생했습니다.');
    }
  }

  return response.json() as Promise<T>;
};
```

### 캐러셀 섹션별 에러 처리

```typescript
// 캐러셀 섹션 에러 처리 컴포넌트
interface CarouselErrorFallbackProps {
  title: string;
  error: Error;
  onRetry: () => void;
}

const CarouselErrorFallback: React.FC<CarouselErrorFallbackProps> = ({ title, error, onRetry }) => (
  <div className={styles.carouselError}>
    <h3>{title}</h3>
    <p className={styles.errorMessage}>{error.message}</p>
    <button onClick={onRetry} className={styles.retryButton}>
      다시 시도
    </button>
  </div>
);

// 캐러셀 섹션 컴포넌트
const CarouselSection: React.FC<CarouselSectionProps> = ({ title, queryKey, queryFn, renderItems }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5분
  });

  if (isLoading) {
    return <CarouselSkeleton title={title} />;
  }

  if (error) {
    return <CarouselErrorFallback title={title} error={error as Error} onRetry={() => refetch()} />;
  }

  return (
    <section className={styles.carouselSection}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <CarouselRow items={data || []}>{renderItems}</CarouselRow>
    </section>
  );
};
```

### 이미지 로딩 에러 처리

```typescript
// 이미지 로딩 에러 처리 컴포넌트
interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  size?: string;
}

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, className, size = 'w500' }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc('/placeholder.png'); // 플레이스홀더 이미지
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

// TMDB 이미지 URL 생성
const getTmdbImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/placeholder.png';

  const baseUrl = import.meta.env.TMDB_BASE_URL || 'https://image.tmdb.org/t/p/';
  return `${baseUrl}${size}${path}`;
};

// 사용 예시
<MovieCard>
  <SafeImage
    src={getTmdbImageUrl(movie.poster_path)}
    alt={movie.title}
    className={styles.posterImage}
  />
</MovieCard>
```

### 검색페이지 에러 처리

```typescript
// 검색 결과 에러 처리
const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';

  const { data, isLoading, error, refetch } = useSearchMovies(query, {
    enabled: query.trim().length > 0,
    retry: 1,
    staleTime: 1000 * 60 * 3, // 3분
  });

  if (query && isLoading) {
    return (
      <div className={styles.searchContainer}>
        <SearchBar defaultValue={query} />
        <GridSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.searchContainer}>
        <SearchBar defaultValue={query} />
        <ErrorMessage error={error as Error} onRetry={refetch} />
      </div>
    );
  }

  if (query && !data?.results?.length) {
    return (
      <div className={styles.searchContainer}>
        <SearchBar defaultValue={query} />
        <EmptyState message="검색 결과가 없습니다." />
      </div>
    );
  }

  return (
    <div className={styles.searchContainer}>
      <SearchBar defaultValue={query} />
      {query && data?.results && (
        <>
          <p className={styles.resultCount}>"{query}" 검색 결과: {data.total_results}개</p>
          <MovieGrid movies={data.results} />
          <Pagination currentPage={data.page} totalPages={data.total_pages} />
        </>
      )}
    </div>
  );
};
```

### 상세페이지 에러 처리

```typescript
// 상세페이지 에러 처리
const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useMovieDetail(id, {
    enabled: !!id,
    retry: 1,
    staleTime: 1000 * 60 * 10, // 10분
  });

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error || !data) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2 className={styles.errorTitle}>
            {error?.message.includes('404') ? '존재하지 않는 영화입니다' : '영화 정보를 불러올 수 없습니다'}
          </h2>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            뒤로가기
          </button>
          <button onClick={() => navigate('/')} className={styles.homeButton}>
            홈으로 이동
          </button>
        </div>
      </div>
    );
  }

  return <MovieDetail movie={data} />;
};
```

### 네트워크 에러 및 재시도 로직

```typescript
// 글로벌 네트워크 에러 핸들러
const handleNetworkError = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return '네트워크 연결을 확인해주세요.';
    }
    if (error.message.includes('timeout')) {
      return '요청 시간이 초과했습니다. 다시 시도해주세요.';
    }
    return error.message;
  }
  return '알 수 없는 오류가 발생했습니다.';
};

// 에러 메시지 컴포넌트
interface ErrorMessageProps {
  error: Error;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => (
  <div className={styles.errorMessage}>
    <p className={styles.errorText}>{handleNetworkError(error)}</p>
    {onRetry && (
      <button onClick={onRetry} className={styles.retryButton}>
        다시 시도
      </button>
    )}
  </div>
);
```

### 에러 추적 및 모니터링

```typescript
// 에러 추적 유틸리티
const logError = (error: Error, context?: Record<string, unknown>) => {
  console.error('Error:', error, 'Context:', context);

  // 프로덕션 환경에서는 에러 추적 서비스로 전송
  if (import.meta.env.PROD) {
    // trackError(error, context);
  }
};

// 사용 예시
try {
  await tmdbFetch('/movie/popular');
} catch (error) {
  logError(error as Error, { page: 'main', section: 'popular' });
  throw error;
}
```

```

```
