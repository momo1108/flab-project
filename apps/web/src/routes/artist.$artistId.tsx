import { createFileRoute } from '@tanstack/react-router';
import ArtistPage from '@/pages/ArtistPage/ArtistPage';

export const Route = createFileRoute('/artist/$artistId')({
  component: ArtistPage,
});
