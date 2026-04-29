# 개발 스크립트 및 팁

## 사용 가능한 스크립트

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

## 개발 팁

### 자동 Import

TypeScript는 자동으로 import를 생성하지 않으므로 명시적으로 작성해야 합니다. IDE의 자동 완성 기능을 적극 활용하세요.

### Props Drilling 방지

깊은 컴포넌트 트리에서는 다음 방법들을 고려하세요:
- React Context API 사용
- Tanstack Query로 서버 상태 관리
- Zustand나 Redux 같은 전역 상태 관리 라이브러리

### 메모리 누수 방지

```typescript
useEffect(() => {
  const subscription = someApi.subscribe();

  return () => {
    subscription.unsubscribe(); // cleanup 함수
  };
}, []);
```

### 쿼리 의존성 관리

Tanstack Query 쿼리 키를 일관되게 사용하여 데이터 동기화를 유지하세요:

```typescript
// 좋은 예: Query Key Factory 사용
const queryKey = userKeys.detail(userId);

// 나쁜 예: 직접 문자열 작성
const queryKey = ['user', userId];
```

## 성능 디버깅 도구

### React DevTools

- **Components**: 컴포넌트 트리 및 props/state 확인
- **Profiler**: 렌더링 성능 분석
- **Flamegraph**: 렌더링 시간 시각화

### Webpack Bundle Analyzer

```bash
# 번들 분석 리포트 생성
npm run build:production

# 분석 리포트 확인
open dist/bundle-report.html
```

### Lighthouse

```bash
# 성능 점수 확인
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

## 트러블슈팅

### 빌드 속도가 느릴 때

1. 불필요한 플러그인 제거
2. `thread-loader` 또는 `swc-loader` 사용
3. `cache-loader`로 캐싱 활성화

### 번들 크기가 클 때

1. `webpack-bundle-analyzer`로 큰 의존성 확인
2. Tree Shaking이 제대로 작동하는지 확인
3. 코드 분할 적용
4. 불필요한 의존성 제거

### HMR이 작동하지 않을 때

1. `webpack-dev-server` 설정 확인
2. 파일 시스템 감시 제한 확인 (`fs.inotify.max_user_watches`)
3. 방화벽 설정 확인

## 테스트 관련 (준비 중)

현재 프로젝트는 테스트 프레임워크가 설정되어 있지 않습니다. 필요시 다음 도구를 고려하세요:
- Jest + React Testing Library
- Vitest + React Testing Library
- Playwright (E2E 테스트)

## 코드 리뷰 체크리스트

- [ ] TypeScript 타입이 모두 정의되어 있는가?
- [ ] 불필요한 `any` 타입은 없는가?
- [ ] React 컴포넌트가 적절하게 분리되어 있는가?
- [ ] Hooks 의존성 배열이 올바른가?
- [ ] 에러 처리가 적절하게 구현되어 있는가?
- [ ] API 쿼리 키가 일관되게 사용되는가?
- [ ] 성능 최적화가 고려되었는가?
- [ ] 접근성 (a11y)이 고려되었는가?
- [ ] 주석이 필요한 곳에 적절히 작성되어 있는가?
