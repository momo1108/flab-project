// src/routes/__root.tsx
// 어플리케이션 내 모든 라우트의 엔트리포인트를 정의한다.
// head 태그 내의 SEO 메타 정보(name, content, title)나 style sheet,
import { createRootRouteWithContext, HeadContent, Link, Outlet, Scripts } from '@tanstack/react-router';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import globalCssInline from '../styles.css?inline';
import type { QueryClient } from '@tanstack/react-query';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import { useEffect, useState } from 'react';

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
  }),
  component: RootComponent,
  notFoundComponent: () => <NotFoundPage />,
  ssr: false, // SPA + prerendering 구조로 배포하기 위해 SSR 비활성화
});

// SPA 의 html 파일의 내용을 정의하는 컴포넌트
function RootComponent() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <style>{globalCssInline}</style>
      </head>

      <body>
        <div className="mainLayout">
          <header className="mainHeader">
            <div className="mainHeaderContainer">
              <Link to="/" className="mainHeaderLogo" aria-label="홈으로 이동">
                FLAB
              </Link>
              <nav className="mainHeaderNav">
                <Link to="/search" className="mainHeaderSearchButton" aria-label="검색">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </Link>
              </nav>
            </div>
          </header>
          <main className="mainContent">
            {isMounted ? (
              <Outlet />
            ) : (
              <div className="mainContentPageLoading">
                <div className="spinner" />
                <p className="mainContentPageLoadingText">페이지를 불러오는 중입니다...</p>
              </div>
            )}
          </main>
          <footer className="mainFooter">
            <div className="mainFooterContainer">
              <div className="mainFooterContent">
                <div className="mainFooterSection">
                  <h3 className="mainFooterSectionTitle">정책</h3>
                  <ul className="mainFooterLinks">
                    <li>
                      <a href="/privacy">개인정보 처리방침</a>
                    </li>
                    <li>
                      <a href="/terms">이용약관</a>
                    </li>
                  </ul>
                </div>

                <div className="mainFooterSection">
                  <h3 className="mainFooterSectionTitle">고객센터</h3>
                  <ul className="mainFooterLinks">
                    <li>
                      <a href="/support">자주 묻는 질문</a>
                    </li>
                    <li>
                      <a href="/contact">문의하기</a>
                    </li>
                  </ul>
                </div>

                <div className="mainFooterSection">
                  <h3 className="mainFooterSectionTitle">회사정보</h3>
                  <ul className="mainFooterLinks">
                    <li>
                      <a href="/about">회사 소개</a>
                    </li>
                    <li>
                      <a href="/careers">채용</a>
                    </li>
                  </ul>
                </div>

                <div className="mainFooterSection">
                  <h3 className="mainFooterSectionTitle">SNS</h3>
                  <div className="mainFooterSocialLinks">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                      </svg>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mainFooterCopyright">
                <p>&copy; 2024 FLAB. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
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
