import { PageLoadingFallback } from '@/components/PageLoadingFallback/PageLoadingFallback';
import MovieDetailPage from '@/pages/MovieDetailPage/MovieDetailPage';
import { configurationQueryObj } from '@/services/tmdb/queries/configuration';
import { movieDetailQuery } from '@/services/tmdb/queries/movie';
import { queryOptions } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/movie/$movieId')({
  component: MovieDetailPage,
  loader: async ({ context, params: { movieId } }) => {
    // 영화 상세 정보 쿼리 preload
    const parsedMovieId = parseInt(movieId);
    await context.queryClient.ensureQueryData(queryOptions(movieDetailQuery(parsedMovieId)));
    await context.queryClient.ensureQueryData(queryOptions(configurationQueryObj));

    // 영화 상세 페이지에서 필요한 다른 쿼리들로, 쿼리 수가 너무 많아서 비활성화
    // await context.queryClient.ensureQueryData(queryOptions(movieCreditsQuery(parsedMovieId)));
    // await context.queryClient.ensureQueryData(queryOptions(movieVideosQuery(parsedMovieId)));
    // await context.queryClient.ensureQueryData(queryOptions(movieImagesQuery(parsedMovieId)));
    // await context.queryClient.ensureQueryData(queryOptions(similarMoviesQuery(parsedMovieId, 1, true, 16)));
  },
  pendingComponent: () => <PageLoadingFallback msg="데이터를 불러오는 중입니다..." />,
  pendingMs: 1000, // 최소 1000ms 이후에 pendingComponent를 보여줌
  pendingMinMs: 200, // pendingComponent가 보여진 후 최소 200ms는 보여줌
});
