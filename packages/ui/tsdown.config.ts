import { defineConfig } from 'tsdown';

// tsconfig.json - isolatedDeclarations 옵션을 활성화한 경우 config 객체 타입을 지정해야 합니다.
const config: ReturnType<typeof defineConfig> = defineConfig({
  entry: ['./src/**/index.ts'],
  outDir: './dist',
  dts: true,
  format: {
    esm: {
      target: ['es2017'],
    },
    cjs: {
      target: ['es2017'],
    },
  },
  clean: true,
  css: {
    modules: {
      // Scoping behavior: 'local' (default) or 'global'
      scopeBehaviour: 'local',

      // Pattern for scoped class names (Lightning CSS pattern syntax)
      generateScopedName: '[hash]_[local]',

      // Transform class name convention in JS exports
      localsConvention: 'camelCase',
    },
    inject: true,
  },
});

export default config;
