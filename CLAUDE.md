# FLAB Project - Development Guidelines

## 프로젝트 개요

- **프로젝트 목표**: TMDB(The Movie Database) API를 활용하여 Watcha 클론 영화 정보 서비스 구현
- **주요 기능**: 메인페이지, 검색페이지, 상세페이지
- **배포 환경**: CloudFront + S3 정적 호스팅
- **UI/UX**: 반응형 디자인, 캐러셀 기반 메인페이지 구성
- **성능 목표**: 페이지 초기 로드 시간 < 3초

### 기술 스택

- **프레임워크**: React 19.2.5 + TypeScript 6.0.3
- **번들러**: Webpack 5
- **라우팅**: React Router 7.14.2
- **상태관리**: Tanstack Query 5.100.3
- **스타일링**: CSS Modules
- **코드 품질**: ESLint 9 (Flat Config) + Prettier + Husky + lint-staged

## 문서 가이드

이 프로젝트의 상세한 개발 가이드라인은 다음 문서들을 참고하세요:

### 기본 설정 및 규칙
- [프로젝트 개요](.claude/docs/project-overview.md) - 기술 스택 및 프로젝트 목표
- [환경 설정](.claude/docs/environment.md) - TypeScript, Prettier, ESLint, Husky 설정
- [코딩 컨벤션](.claude/docs/coding-conventions.md) - 명명 규칙, 커밋 컨벤션, 타입 정의

### React 및 프레임워크
- [React 코딩 규칙](.claude/docs/react-conventions.md) - 컴포넌트 구조, Hooks 사용, 성능 최적화
- [React Router 가이드](.claude/docs/react-router.md) - 라우팅 구성, 네비게이션, 파라미터 처리
- [Tanstack Query 가이드](.claude/docs/tanstack-query.md) - 서버 상태 관리 패턴, 쿼리/뮤테이션 작성

### 프로젝트 구조 및 개발
- [시스템 아키텍처](.claude/docs/architecture.md) - 전체 시스템 아키텍처, 레이어 구조, 데이터 흐름
- [API 통합 가이드](.claude/docs/api-integration.md) - TMDB API 사용법, 데이터 구조, 캐시 정책
- [기능별 상세 명세](.claude/docs/feature-specifications.md) - 페이지별 구성, 컴포넌트 설계, 데이터 흐름
- [비기능 요구사항](.claude/docs/non-functional-requirements.md) - 성능, 사용성, 신뢰성, 보안, 확장성
- [파일 구조](.claude/docs/file-structure.md) - 권장 폴더 구조, 파일 명명 규칙
- [에러 처리](.claude/docs/error-handling.md) - API 에러 처리, 에러 바운더리, 글로벌 에러 핸들러
- [빌드 및 성능](.claude/docs/build-performance.md) - Webpack 최적화, 코드 분할, 번들 분석
- [개발 스크립트](.claude/docs/development-scripts.md) - 사용 가능한 npm 스크립트, 개발 팁, 트러블슈팅

### 인프라 및 운영
- [배포 아키텍처](.claude/docs/deployment-architecture.md) - CloudFront + S3 배포 구조, 캐시 정책, 배포 프로세스
- [보안 아키텍처](.claude/docs/security.md) - API Key 관리, CORS, S3 보안, CloudFront 보안
- [모니터링 및 로깅](.claude/docs/monitoring.md) - 에러 모니터링, 성능 모니터링, CloudWatch, 로깅

## 빠른 시작

### 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

### 기본 코드 구조

```typescript
// 컴포넌트 예시
interface MyComponentProps {
  title: string;
  onAction?: (value: string) => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  return <div>{title}</div>;
};

// Hook 예시
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
  });
};
```

## 주요 규칙 요약

### TypeScript
- Strict Mode 활성화
- 모든 Props와 함수에 타입 정의 필수
- `any` 타입 사용 지양

### React
- 컴포넌트는 PascalCase, Hooks는 camelCase
- Props 인터페이스는 `{ComponentName}Props` 형태
- Hooks는 컴포넌트 최상위에서만 호출

### 코드 품질
- Husky + lint-staged로 커밋 전 자동 검사
- Prettier로 코드 포맷팅 통일
- ESLint로 코드 품질 검증

### 커밋 컨벤션
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `refactor`: 코드 구조 개선
- `test`: 테스트 코드
- `chore`: 프로젝트 설정

## 사용 가능한 스크립트

```bash
npm start              # 개발 서버 시작
npm run type-check     # TypeScript 타입 검사
npm run build:staging  # 스테이징 빌드
npm run build:production  # 프로덕션 빌드
npm run lint           # ESLint 검사
npm run lint:fix       # ESLint 자동 수정
npm run format         # Prettier 포맷팅
npm run format:check   # Prettier 확인
```

## 추가 리소스

### 기술 문서
- [React 공식 문서](https://react.dev)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Tanstack Query 문서](https://tanstack.com/query/latest)
- [React Router 문서](https://reactrouter.com)

### 프로젝트 관련
- [TMDB API Documentation](https://developer.themoviedb.org/docs)
- [TMDB API v3](https://developer.themoviedb.org/reference/intro/getting-started)
- [Watcha 클론 프로젝트 요구사항](./docs/REQUIREMENTS.md)
- [Watcha 클론 프로젝트 기능 명세서](./docs/SPECIFICATIONS.md)
