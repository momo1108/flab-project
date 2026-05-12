import { Routes, Route } from 'react-router';
import { Providers } from './components/Providers';
import { MainLayout } from './components/Layout/MainLayout';
import MainPage from './pages/MainPage/MainPage';
import SearchPage from './pages/SearchPage/SearchPage';
import MovieDetailPage from './pages/MovieDetailPage/MovieDetailPage';
import ArtistPage from './pages/ArtistPage/ArtistPage';

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
