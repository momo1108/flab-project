import path from 'path';
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import visualizer from 'rollup-plugin-visualizer';

// 번들 분석 보고서 파일명에 타임스탬프 추가
const pad2 = (value) => String(value).padStart(2, '0');

const now = new Date();
const year = now.getFullYear();
const month = pad2(now.getMonth() + 1);
const day = pad2(now.getDate());
const hour = pad2(now.getHours());
const minute = pad2(now.getMinutes());
const second = pad2(now.getSeconds());

const buildTimeStamp = `${year}${month}${day}-${hour}${minute}${second}`;

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      babel({
        presets: [
          reactCompilerPreset({
            validation: true,
            noProfile: false,
          }),
        ],
      }),
      ...(mode === 'staging'
        ? [
            visualizer({
              filename: `dist/bundle-report-${buildTimeStamp}.html`,
              open: false,
              gzipSize: true,
              brotliSize: true,
            }),
            visualizer({
              filename: `dist/bundle-stats-${buildTimeStamp}.json`,
              template: 'raw-data',
              gzipSize: true,
              brotliSize: true,
            }),
          ]
        : []),
    ],
    server: {
      host: 'localhost',
      port: 3000,
      open: true,
    },
    preview: {
      host: 'localhost',
      port: 4173,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
    },
    assetsInclude: [/\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i],
    // assetsInlineLimit: 4096, // 4KB 가 기본값
  };
});
