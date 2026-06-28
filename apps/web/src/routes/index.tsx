import MainPage from '@/pages/MainPage/MainPage';
import { trendingMoviesQuery } from '@/services/tmdb/queries/movies';
import { queryOptions } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: MainPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(queryOptions(trendingMoviesQuery('day', 10)));
  },
});
