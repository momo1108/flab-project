import { Routes, Route } from 'react-router';
import { Providers } from './components/Providers';
import MainPage from './pages/MainPage';

function App() {
  return (
    <Providers>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* 추후에 다른 라우트 추가 예정
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movie/:id" element={<DetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
        */}
      </Routes>
    </Providers>
  );
}

export default App;
