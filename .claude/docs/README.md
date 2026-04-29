# 문서 개요

이 폴더에는 FLAB 프로젝트의 개발 가이드라인과 에이전트 개발 규칙들이 포함되어 있습니다.

## 원본 문서

프로젝트 개발에 필요한 상세 내용은 원본 문서들을 참고하세요:

- **docs/mainpage.md**: 메인페이지 구현 방식, TMDB API 명세, UI/UX 톤, 메인페이지 구현용 API 필터링
- **docs/REQUIREMENTS.md**: Watcha 클론 프로젝트 요구사항 정의서 (PRD)
- **docs/SPECIFICATIONS.md**: Watcha 클론 프로젝트 기능 명세서
- **docs/ARCHITECTURE.md**: Watcha 클론 프로젝트 시스템 아키텍처 (전체 구조, 배포 아키텍처, 데이터 흐름, 상태 관리, 캐싱, 에러 처리, 보안, 성능 최적화, 배포 프로세스, 모니터링, 개발/프로덕션 환경 설정)

## 에이전트 개발 가이드

### 기본 설정 및 규칙
- **project-overview.md**: 프로젝트 개요, 기술 스택, 프로젝트 목표
- **environment.md**: TypeScript, Prettier, ESLint, Husky 설정
- **coding-conventions.md**: 명명 규칙, 커밋 컨벤션, 타입 정의

### React 및 프레임워크
- **react-conventions.md**: React 컴포넌트 구조, Hooks 사용, 성능 최적화
- **react-router.md**: 라우팅 구성, 네비게이션, 파라미터 처리 (FLAB 프로젝트 라우팅 구조 포함)
- **tanstack-query.md**: 서버 상태 관리 패턴, 쿼리/뮤테이션 작성 (FLAB 프로젝트 캐시 정책 포함)

### 프로젝트 구조 및 개발
- **architecture.md**: 전체 시스템 아키텍처, 레이어 구조, 데이터 흐름
- **api-integration.md**: TMDB API 사용법, 데이터 구조, 캐시 정책, 호출 순서
- **feature-specifications.md**: 페이지별 구성, 컴포넌트 설계, 데이터 흐름, 메인페이지 섹션 규칙
- **non-functional-requirements.md**: 성능, 사용성, 신뢰성, 보안, 확장성 요구사항
- **file-structure.md**: 권장 폴더 구조, 파일 명명 규칙 (FLAB 프로젝트 구조 포함)
- **error-handling.md**: API 에러 처리, 에러 바운더리, 글로벌 에러 핸들러 (TMDB API 에러 처리 포함)
- **build-performance.md**: Webpack 최적화, 코드 분할, 번들 분석 (FLAB 프로젝트 성능 요구사항 포함)
- **development-scripts.md**: 사용 가능한 npm 스크립트, 개발 팁, 트러블슈팅

### 인프라 및 운영
- **deployment-architecture.md**: CloudFront + S3 배포 구조, 캐시 정책, 배포 프로세스
- **security.md**: API Key 관리, CORS, S3 보안, CloudFront 보안, 보안 헤더
- **monitoring.md**: 에러 모니터링, 성능 모니터링, CloudWatch, 로깅, 사용자 행동 추적

## 문서 사용법

### 에이전트 개발 시
1. **project-overview.md**로 프로젝트 개요 확인
2. **api-integration.md**로 TMDB API 통합 방법 확인
3. **feature-specifications.md**로 기능별 상세 명세 확인
4. **non-functional-requirements.md**로 비기능 요구사항 확인
5. 각 기술별 가이드 (React, Router, Query 등) 참고

### 새로운 기능 개발 시
1. **feature-specifications.md**로 해당 기능의 명세 확인
2. **api-integration.md**로 필요한 API 확인
3. **file-structure.md**로 적절한 파일 위치 확인
4. 각 기술별 가이드 참고하여 구현

### 문서 업데이트 시
- 원본 문서 (docs/mainpage.md, docs/REQUIREMENTS.md, docs/SPECIFICATIONS.md)가 변경되면
- 해당 내용을 반영하여 에이전트 가이드 문서들 업데이트
- 특히 API 변경, 기능 변경, 요구사항 변경사항 반영