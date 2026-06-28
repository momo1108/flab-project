import SearchPage from '@/pages/SearchPage/SearchPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/search')({
  component: SearchPage,
});
