import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import { Providers } from './components/Providers';
import { MainLayout } from './components/Layout/MainLayout';
import { PageLoadingFallback } from './components/PageLoadingFallback/PageLoadingFallback';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

const MainPage = lazy(() => import('./pages/MainPage/MainPage'));
const SearchPage = lazy(() => import('./pages/SearchPage/SearchPage'));
const MovieDetailPage = lazy(() => import('./pages/MovieDetailPage/MovieDetailPage'));
const ArtistPage = lazy(() => import('./pages/ArtistPage/ArtistPage'));

function App() {
  return (
    <Providers>
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<MainPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="movie/:id" element={<MovieDetailPage />} />
            <Route path="artist/:id" element={<ArtistPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Providers>
  );
}

export default App;
