import { PageLoadingFallback } from '@/components/PageLoadingFallback/PageLoadingFallback';
import SearchPage from '@/pages/SearchPage/SearchPage';
import { configurationQueryObj } from '@/services/tmdb/queries/configuration';
import { genresQueryObj } from '@/services/tmdb/queries/genre';
import { popularMoviesQuery } from '@/services/tmdb/queries/movies';
import { queryOptions } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/search')({
  component: SearchPage,
  loader: async ({ context }) => {
    // 최상단에 출력될 영화 데이터 쿼리 2개와 이미지 url 생성을 위한 configuration 쿼리 prel
    await context.queryClient.ensureQueryData(queryOptions(popularMoviesQuery(1)));
    await context.queryClient.ensureQueryData(queryOptions(genresQueryObj));
    await context.queryClient.ensureQueryData(queryOptions(configurationQueryObj));
  },
  pendingComponent: () => <PageLoadingFallback msg="데이터를 불러오는 중입니다..." />,
  pendingMs: 1000, // 최소 1000ms 이후에 pendingComponent를 보여줌
  pendingMinMs: 200, // pendingComponent가 보여진 후 최소 200ms는 보여줌
});
