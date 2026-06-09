import { Link, useParams } from 'react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { similarMoviesQuery } from '@/services/tmdb/queries/moviesQueries';
import { useImageUrls } from '@/hooks/useImageUrls';
import styles from '../MovieDetailPage.module.css';
import { useMemo } from 'react';

export const RelatedContentTab = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id ? Number.parseInt(id, 10) : 0;

  const { data: similarMoviesData } = useSuspenseQuery(similarMoviesQuery(movieId, 1, true));
  const similarMovies = useMemo(() => {
    return similarMoviesData.results.slice(0, 16);
  }, [similarMoviesData]);

  const { getImageUrl } = useImageUrls();

  return (
    <>
      {similarMovies.length > 0 ? (
        <div className={styles.similarMoviesGrid}>
          {similarMovies.map((similarMovie) => (
            <Link key={similarMovie.id} to={`/movie/${similarMovie.id}`} className={styles.similarMovieItem}>
              <img
                src={getImageUrl(similarMovie.poster_path, 'poster', 'w500')}
                alt={similarMovie.title}
                className={styles.similarMoviePoster}
              />
            </Link>
          ))}
        </div>
      ) : (
        <p className={styles.emptyState}>관련 영화가 없습니다.</p>
      )}
    </>
  );
};
