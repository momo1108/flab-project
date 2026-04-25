import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  {
    // Flat Config에서는 .eslintignore 대신 ignores를 사용
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    // 검사할 파일 패턴 지정
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // ESLint의 JavaScript 관련 기본 권장 규칙을 적용
    // (기본적인 문법 오류와 잠재적인 문제를 방지하는 규칙들이 포함)
    plugins: { js },
    extends: ['js/recommended'],
    // 브라우저 환경의 전역 변수를 인식하도록 설정 (window, document 등)
    languageOptions: { globals: globals.browser },
  },
  // TypeScript를 위한 권장 규칙을 적용
  // (TypeScript 코드에서 발생할 수 있는 문제를 방지하는 규칙들이 포함)
  tseslint.configs.recommended,
  // React를 위한 권장 규칙을 적용
  // React 관련 코드에서 발생할 수 있는 문제를 방지하는 규칙들이 포함
  // flat 구조를 사용하여 최신 방식으로 설정을 가져옴
  pluginReact.configs.flat.recommended,
  eslintPluginPrettierRecommended,
  {
    settings: {
      react: {
        version: 'detect', // React 버전 자동 감지
      },
    },
    rules: {
      'no-unused-vars': 'error', // 미사용 변수 발견 시 에러
      'react/prop-types': 'off', // Typescript 로 props 의 타입 검증을 할 수 있으니 비활성화

      // pluginReact.configs.flat.recommended 에서 활성화된 옵션을 비활성화
      // 현재 프로젝트의 babel 설정에 react preset 옵션으로 runtime: automatic 을 설정했기 때문에
      // 불필요한 옵션임
      'react/react-in-jsx-scope': 'off',

      // 'no-undef': 'error' // 정의되지 않은 변수 사용 시 에러
      // no-undef 사용 시 import React from 'react' 안하면 React 를 인식 못하기 때문에
      // @typescript-eslint 쪽 규칙을 사용할 수 있도록 비활성화
    },
  },
  {
    // Node.js 환경에서 실행되는 설정 파일은 CJS(require/module.exports)가 정상이므로
    // 브라우저/TS 규칙 대신 Node.js 환경으로 별도 처리
    files: ['webpack.*.js', 'babel.config.json'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]);
