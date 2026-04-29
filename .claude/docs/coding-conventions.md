# 코딩 컨벤션

## 명명 규칙

- **컴포넌트**: PascalCase (예: `MyComponent`)
- **유틸/훅**: camelCase (예: `useUsers`, `formatDate`)
- **API 라우트**: kebab-case (예: `/api/user-info`)
- **상수**: UPPER_SNAKE_CASE (예: `MAX_RETRY_COUNT`)
- **타입/인터페이스**: PascalCase (예: `User`, `ApiResponse`)

## 코드 주석

- 코드 주석은 한국어 허용
- 복잡한 로직에는 반드시 주석 추가
- 불필요한 주석은 피하고 코드가 스스로 설명하도록 작성

## API 응답 형식

API 응답은 항상 다음 형태로 통일:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}
```

## 커밋 컨벤션

| Type     | Description                                    | Example                              |
| -------- | ---------------------------------------------- | ------------------------------------ |
| feat     | 새로운 기능 추가                               | feat(auth): 로그인 기능 추가         |
| fix      | 버그 수정                                      | fix(api): 사용자 정보 조회 오류 수정 |
| docs     | 문서 수정 (README, 주석 등)                    | docs(readme): 설치 방법 추가         |
| refactor | 코드 구조 개선 (동작 변화 없음)                | refactor(utils): 공통 함수 분리      |
| test     | 테스트 코드 추가 또는 수정                     | test(login): 로그인 유닛 테스트 추가 |
| chore    | 프로젝트 관련 설정 (초기화, 빌드 관련 설정 등) | chore(webpack): 번들 설정 추가       |

## TypeScript 타입 정의

- 인터페이스는 객체 타입 정의에 사용
- 타입 별칭은 유니온, 교차 타입 등에 사용
- 제네릭 타입은 명시적이고 의미 있는 이름 사용
- `any` 타입 사용 지양, `unknown` 또는 구체적인 타입 사용
