import { PageLoadingFallback } from '@/components/PageLoadingFallback/PageLoadingFallback';
import MovieDetailPage from '@/pages/MovieDetailPage/MovieDetailPage';
import { configurationQueryObj } from '@/services/tmdb/queries/configuration';
import { movieDetailQuery } from '@/services/tmdb/queries/movie';
import { queryOptions } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/movie/$movieId')({
  component: MovieDetailPage,
  params: {
    // movieId 를 숫자로 변환하고, 숫자가 아닌 경우 라우트 매칭을 스킵하도록 parse 메서드를 구현
    // https://tanstack.com/router/latest/docs/api/router/RouteOptionsType#params-parse-method
    parse: ({ movieId }) => {
      // movieId가 숫자가 아닌 경우, 다음으로 매칭되는 라우트로 넘긴다
      if (!/^\d+$/.test(movieId)) return false;
      return { movieId: Number(movieId) };
    },
    stringify: ({ movieId }) => ({ movieId: String(movieId) }),
  },
  loader: async ({ context, params: { movieId } }) => {
    // 영화 상세 정보 쿼리 preload
    await context.queryClient.ensureQueryData(queryOptions(movieDetailQuery(movieId)));
    await context.queryClient.ensureQueryData(queryOptions(configurationQueryObj));

    // 영화 상세 페이지에서 필요한 다른 쿼리들로, 쿼리 수가 너무 많아서 비활성화
    // await context.queryClient.ensureQueryData(queryOptions(movieCreditsQuery(movieId)));
    // await context.queryClient.ensureQueryData(queryOptions(movieVideosQuery(movieId)));
    // await context.queryClient.ensureQueryData(queryOptions(movieImagesQuery(movieId)));
    // await context.queryClient.ensureQueryData(queryOptions(similarMoviesQuery(movieId, 1, true, 16)));
  },
  pendingComponent: () => <PageLoadingFallback msg="데이터를 불러오는 중입니다..." />,
  pendingMs: 1000, // 최소 1000ms 이후에 pendingComponent를 보여줌
  pendingMinMs: 200, // pendingComponent가 보여진 후 최소 200ms는 보여줌
});
