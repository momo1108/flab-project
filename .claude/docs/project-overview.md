# FLAB Project - Project Overview

## 프로젝트 기술 스택

- **프레임워크**: React 19.2.5 + TypeScript 6.0.3
- **번들러**: Webpack 5
- **라우팅**: React Router 7.14.2
- **상태관리**: Tanstack Query 5.100.3
- **스타일링**: CSS Modules
- **코드 품질**: ESLint 9 (Flat Config) + Prettier + Husky + lint-staged

## 프로젝트 목표

TMDB(The Movie Database) API를 활용하여 Watcha 클론 영화 정보 서비스를 구현합니다.

- **주요 기능**: 메인페이지, 검색페이지, 상세페이지
- **배포 환경**: CloudFront + S3 정적 호스팅
- **UI/UX**: 반응형 디자인, 캐러셀 기반 메인페이지 구성
- **성능 목표**: 페이지 초기 로드 시간 < 3초

## 주요 특징

- TypeScript Strict Mode로 타입 안전성 보장
- Webpack 5로 최적화된 번들링
- Tanstack Query로 효율적인 서버 상태 관리
- React Router 7로 최신 라우팅 기능 활용
- Husky + lint-staged로 코드 품질 자동화

## 관련 문서

이 프로젝트의 상세한 개발 가이드라인은 다음 문서들을 참고하세요:

### 기본 설정 및 규칙
- [환경 설정](./environment.md) - TypeScript, Prettier, ESLint 설정
- [코딩 컨벤션](./coding-conventions.md) - 명명 규칙 및 커밋 컨벤션

### React 및 프레임워크
- [React 코딩 규칙](./react-conventions.md) - React 컴포넌트 작성 가이드
- [React Router 가이드](./react-router.md) - 라우팅 구성 및 사용법
- [Tanstack Query 가이드](./tanstack-query.md) - 서버 상태 관리 패턴

### 프로젝트 구조 및 개발
- [시스템 아키텍처](./architecture.md) - 전체 시스템 아키텍처, 레이어 구조, 데이터 흐름
- [API 통합 가이드](./api-integration.md) - TMDB API 사용법, 데이터 구조, 캐시 정책
- [기능별 상세 명세](./feature-specifications.md) - 페이지별 구성, 컴포넌트 설계, 데이터 흐름
- [비기능 요구사항](./non-functional-requirements.md) - 성능, 사용성, 신뢰성, 보안, 확장성
- [파일 구조](./file-structure.md) - 권장 폴더 구조
- [에러 처리](./error-handling.md) - API 에러 처리 방법
- [빌드 및 성능](./build-performance.md) - Webpack 최적화 설정
- [개발 스크립트](./development-scripts.md) - 사용 가능한 npm 스크립트

### 인프라 및 운영
- [배포 아키텍처](./deployment-architecture.md) - CloudFront + S3 배포 구조, 캐시 정책, 배포 프로세스
- [보안 아키텍처](./security.md) - API Key 관리, CORS, S3 보안, CloudFront 보안
- [모니터링 및 로깅](./monitoring.md) - 에러 모니터링, 성능 모니터링, CloudWatch, 로깅
