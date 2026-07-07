import { createFileRoute } from '@tanstack/react-router';
import ArtistPage from '@/pages/ArtistPage/ArtistPage';

export const Route = createFileRoute('/artist/$artistId')({
  component: ArtistPage,
  params: {
    // artistId 를 숫자로 변환하고, 숫자가 아닌 경우 라우트 매칭을 스킵하도록 parse 메서드를 구현
    // https://tanstack.com/router/latest/docs/api/router/RouteOptionsType#params-parse-method
    parse: ({ artistId }) => {
      // artistId가 숫자가 아닌 경우, 다음으로 매칭되는 라우트로 넘긴다
      if (!/^\d+$/.test(artistId)) return false;
      return { artistId: Number(artistId) };
    },
    stringify: ({ artistId }) => ({ artistId: String(artistId) }),
  },
});
