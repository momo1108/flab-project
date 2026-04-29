# 환경 설정

## TypeScript 규칙

- **Strict Mode**: 활성화 (모든 TypeScript 규칙 준수)
- **JSX**: react-jsx (React import 불필요)
- **Module**: esnext
- **Target**: es5
- **주요 옵션**:
  - `noUncheckedIndexedAccess`: true
  - `exactOptionalPropertyTypes`: true
  - `verbatimModuleSyntax`: true
  - `isolatedModules`: true

## Prettier 설정

```javascript
printWidth: 120,
tabWidth: 2,
singleQuote: true,
trailingComma: 'all',
semi: true,
```

## ESLint 규칙

- JavaScript & TypeScript 기본 권장 규칙 활성화
- React 권장 규칙 활성화 (`eslint-plugin-react`)
- `react/react-in-jsx-scope`: off (auto JSX runtime)
- `react/prop-types`: off (TypeScript로 타입 검증)
- `no-unused-vars`: error

## Husky + lint-staged 설정

**Husky**: Git hooks를 통해 commit 전 자동으로 린트/포맷팅 실행
**lint-staged**: 스테이징된 파일(`git add`)만 선택적으로 검사

```bash
# Pre-commit Hook 자동 실행
# 1. Prettier로 코드 포맷팅
# 2. ESLint --fix로 자동 수정 가능한 문제 해결
# 3. 통과하면 commit 진행, 실패하면 commit 차단
```

**대상 파일**: `*.{js,jsx,ts,tsx,css}`
