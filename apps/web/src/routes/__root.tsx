// src/routes/__root.tsx
// 어플리케이션 내 모든 라우트의 엔트리포인트를 정의한다.
// head 태그 내의 SEO 메타 정보(name, content, title)나 style sheet,
import { createRootRouteWithContext, HeadContent } from '@tanstack/react-router';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import '@flab/ui/style.css';
import '../styles.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from '@/components/Layout/MainLayout.module.css';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import type { QueryClient } from '@tanstack/react-query';

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
        title: 'TanStack Start Starter',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>

      <body>
        <Header />
        <main className={styles.mainContent}>{children}</main>
        <Footer />
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
      </body>
    </html>
  );
}
