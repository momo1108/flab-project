# React 코딩 규칙

## 컴포넌트 구조

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

## Props 타입 정의

- 모든 Props는 `interface` 또는 `type`으로 정의
- Props 이름: `{ComponentName}Props`
- Optional props는 `?` 사용
- 콜백 함수는 `(arg: Type) => ReturnType` 형식

## Hooks 사용

- `useCallback`, `useMemo` 필수 의존성 배열 완성
- `useEffect` 효과 정리(cleanup) 함수 제공 (필요시)
- Custom hooks는 `use` prefix 사용
- Hook 호출은 컴포넌트 최상위에서만 수행

## 성능 최적화

- Lazy Loading 활용: `React.lazy()` + `Suspense`
- 코드 분할 주석: `/* webpackChunkName: "chunk-name" */`
- Preload/Prefetch 활용: `/* webpackPreload: true */`, `/* webpackPrefetch: true */`
