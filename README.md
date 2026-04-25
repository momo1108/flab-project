# FLAB Frontend Project

프런트엔드 개발 환경과 동작 방식을 이해하기 위한 프로젝트입니다.

<br>

## Commit / PR Convention

| Type     | Description                                    | Example                              |
| -------- | ---------------------------------------------- | ------------------------------------ |
| feat     | 새로운 기능 추가                               | feat(auth): 로그인 기능 추가         |
| fix      | 버그 수정                                      | fix(api): 사용자 정보 조회 오류 수정 |
| docs     | 문서 수정 (README, 주석 등)                    | docs(readme): 설치 방법 추가         |
| refactor | 코드 구조 개선 (동작 변화 없음)                | refactor(utils): 공통 함수 분리      |
| test     | 테스트 코드 추가 또는 수정                     | test(login): 로그인 유닛 테스트 추가 |
| chore    | 프로젝트 관련 설정 (초기화, 빌드 관련 설정 등) | chore(webpack): 번들 설정 추가       |

<br />

## Branch Convention

각 작업은 **기능/설정 단위별 브랜치**로 분리하며, 브랜치 이름은 `<작업종류>/<작업범위>` 형식을 따릅니다.
( 예: `config/eslint-setup`, `build/webpack-config` )

| Branch Name            | Description                                                     | Base Branch | PR Target |
| ---------------------- | --------------------------------------------------------------- | ----------- | --------- |
| main                   | 기준 브랜치 (모든 작업은 `main` 브랜치에서 분기하여 진행합니다) | -           | -         |
| chore/project-init     | 프로젝트 초기 구조 및 기본 세팅                                 | main        | main      |
| chore/babel-setup      | babel 트랜스파일 설정                                           | main        | main      |
| chore/typescript-setup | typescript 설정                                                 | main        | main      |
| chore/webpack-setup    | webpack 번들링 환경 설정                                        | main        | main      |
| chore/lint-setup       | eslint + prettier 설정                                          | main        | main      |
| chore/optimization     | webpack 최적화 설정                                             | main        | main      |
| chore/ai-rules         | AI tooling 및 코딩 규칙 설정                                    | main        | main      |
