import MovieDetailPage from '@/pages/MovieDetailPage/MovieDetailPage';
import { movieDetailQuery } from '@/services/tmdb/queries/movie';
import { queryOptions } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/movie/$movieId')({
  component: MovieDetailPage,
  loader: async ({ context, params: { movieId } }) => {
    await context.queryClient.ensureQueryData(queryOptions(movieDetailQuery(parseInt(movieId))));
  },
});
