// src/routes/__root.tsx
// 어플리케이션 내 모든 라우트의 엔트리포인트를 정의한다.
// head 태그 내의 SEO 메타 정보(name, content, title)나 style sheet,
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import '@flab/ui/style.css';
import globalCss from '../styles.css?url';
import type { QueryClient } from '@tanstack/react-query';
import { MainLayout } from '@/components/Layout/MainLayout';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Watcha Clone',
      },
    ],
    links: [{ rel: 'stylesheet', href: globalCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => <NotFoundPage />,
  ssr: false, // SPA + prerendering 구조로 배포하기 위해 SSR 비활성화
});

function RootComponent() {
  return <Outlet />;
}

// SPA 의 html 파일의 내용을 정의하는 컴포넌트
function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>

      <body>
        <MainLayout>{children}</MainLayout>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: 'Tanstack Query',
              render: <ReactQueryDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
