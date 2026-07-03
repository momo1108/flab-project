import { PageLoadingFallback } from '@/components/PageLoadingFallback/PageLoadingFallback';
import MainPage from '@/pages/MainPage/MainPage';
import { genresQueryObj } from '@/services/tmdb/queries/genre';
import { popularMoviesQuery, trendingMoviesQuery } from '@/services/tmdb/queries/movies';
import { queryOptions } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: MainPage,
  loader: async ({ context }) => {
    // 최상단에 출력될 영화 데이터 쿼리 2개와 이미지 url 생성을 위한 configuration 쿼리 preload
    await context.queryClient.ensureQueryData(queryOptions(trendingMoviesQuery('day', 10)));
    await context.queryClient.ensureQueryData(queryOptions(popularMoviesQuery(1)));
    await context.queryClient.ensureQueryData(queryOptions(genresQueryObj));

    // 메인 페이지에서 필요한 다른 쿼리들로, 쿼리 수가 너무 많아서 비활성화
    // await context.queryClient.ensureQueryData(queryOptions(popularPersonsQuery(1)));
    // await context.queryClient.ensureQueryData(queryOptions(configurationQueryObj));
  },
  pendingComponent: () => <PageLoadingFallback msg="데이터를 불러오는 중입니다..." />,
  pendingMs: 1000, // 최소 1000ms 이후에 pendingComponent를 보여줌
  pendingMinMs: 200, // pendingComponent가 보여진 후 최소 200ms는 보여줌
});
