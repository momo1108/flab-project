import { lazy } from 'react';
import { Routes, Route } from 'react-router';
import { Providers } from './components/Providers';
import { MainLayout } from './components/Layout/MainLayout';

const MainPage = lazy(() => import('./pages/MainPage/MainPage'));
const SearchPage = lazy(() => import('./pages/SearchPage/SearchPage'));
const MovieDetailPage = lazy(() => import('./pages/MovieDetailPage/MovieDetailPage'));
const ArtistPage = lazy(() => import('./pages/ArtistPage/ArtistPage'));

function App() {
  return (
    <Providers>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<MainPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="movie/:id" element={<MovieDetailPage />} />
          <Route path="artist/:id" element={<ArtistPage />} />
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>
      </Routes>
    </Providers>
  );
}

export default App;
