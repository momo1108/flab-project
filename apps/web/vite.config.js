import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import visualizer from 'rollup-plugin-visualizer';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { devtools } from '@tanstack/devtools-vite';

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

const tmdbProxy = {
  target: 'https://api.themoviedb.org',
  changeOrigin: true,
  secure: true,
  rewrite: (requestPath) => requestPath.replace(/^\/api\/tmdb/, '/3'),
};

const previewStaticShell = () => {
  const shellPath = path.resolve(__dirname, 'dist/client/_shell.html');

  return {
    name: 'preview-static-shell',
    enforce: 'pre',
    configurePreviewServer(server) {
      const middleware = (req, res, next) => {
        const requestUrl = req.url || '/';
        const pathname = requestUrl.split('?')[0] || '/';
        const accept = req.headers.accept || '';

        const isHtmlRequest = accept.includes('text/html');
        const isApiRequest = pathname.startsWith('/api/');
        const isAssetRequest = pathname.startsWith('/assets/') || pathname.includes('.') || pathname.startsWith('/@');

        if (!isHtmlRequest || isApiRequest || isAssetRequest) {
          next();
          return;
        }

        try {
          const html = fs.readFileSync(shellPath, 'utf-8');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(html);
        } catch {
          next();
        }
      };

      // Place middleware at the beginning so it runs before TanStack preview handlers.
      server.middlewares.stack.unshift({ route: '', handle: middleware });
    },
  };
};

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      previewStaticShell(),
      devtools(),
      tanstackStart({
        spa: {
          enabled: true,
        },
      }),
      // react's vite plugin must come after tanstack start's vite plugin
      viteReact(),
      babel({
        presets: [reactCompilerPreset()],
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
    // postcss 설정 파일은 기본적으로 프로젝트 루트의 postcss.config.js 를 참조
    build: {
      outDir: 'dist',
      sourcemap: false,
      // .browserlistrc 에 정의된 브라우저 타겟을 esbuild 의 target 옵션으로 변환하여 적용
      target: browserslistToEsbuild(),
      cssTarget: browserslistToEsbuild(),
    },
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
      tsconfigPaths: true,
    },
    assetsInclude: [/\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i],
    // assetsInlineLimit: 4096, // 4KB 가 기본값
    server: {
      host: 'localhost',
      port: 3000,
      open: true,
      proxy: {
        '/api/tmdb': tmdbProxy,
      },
    },
    preview: {
      host: 'localhost',
      port: 4173,
      proxy: {
        '/api/tmdb': tmdbProxy,
      },
    },
  };
});
