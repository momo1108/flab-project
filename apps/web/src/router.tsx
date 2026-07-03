// src/router.tsx
// tanstack router 의 행동을 정하는 파일이다.
// router.tsx 에서 반드시 getRouter 를 export 해야한다.
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

import { QueryClient } from '@tanstack/react-query';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';

// tanstack router 를 초기화하고 반환하는 함수
export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5분
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // 프리로딩 설정 옵션 : https://tanstack.com/router/latest/docs/guide/preloading
    // <Link> 컴포넌트의 hover, touch start 이벤트 발생 시 해당 route 관련 스크립트를 preloading
    defaultPreload: 'intent',
    // preload 된 리소스의 stale time 을 정할 수 있다.
    // react query 같은 외부 라이브러리가 데이터 로딩, 캐싱을 담당하게 하려면
    // 0 으로 설정하여 페이지의 loader 함수가 항상 실행되도록 하면 된다.
    defaultPreloadStaleTime: 0,
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
