import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  movieDetailQuery,
  movieImagesQuery,
  movieVideosQuery,
  movieCreditsQuery,
  movieReviewsQuery,
  similarMoviesQuery,
} from '../../services/tmdb/tmdbMovies';
import styles from './MovieDetailPage.module.css';
import type { MovieReview } from '../../types/tmdb';
import { MovieHero } from './sections/MovieHero';
import { MovieContentTab } from './sections/MovieContentTab';
import { RelatedContentTab } from './sections/RelatedContentTab';

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id ? Number.parseInt(id, 10) : 0;

  const [activeTab, setActiveTab] = useState<'content' | 'related'>('content');

  const { data: movie, isLoading: isMovieLoading, error: movieError } = useQuery(movieDetailQuery(movieId));
  const { data: images } = useQuery(movieImagesQuery(movieId));
  const { data: videos, isLoading: isVideosLoading } = useQuery(movieVideosQuery(movieId));
  const { data: credits, isLoading: isCreditsLoading } = useQuery(movieCreditsQuery(movieId));

  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    hasNextPage: hasMoreReviews,
    fetchNextPage: fetchMoreReviews,
    isFetchingNextPage: isFetchingMoreReviews,
  } = useInfiniteQuery(movieReviewsQuery(movieId, activeTab === 'content'));

  const currentReviews = reviewsData?.pages?.reduce<MovieReview[]>((acc, page) => [...acc, ...page.results], []) ?? [];
  const reviewCount = reviewsData?.pages?.[0]?.total_results ?? 0;

  const { data: similarMovies, isLoading: isSimilarLoading } = useQuery(
    similarMoviesQuery(movieId, 1, activeTab === 'related'),
  );

  // Reset state when movieId changes
  useEffect(() => {
    setActiveTab('content');
    window.scrollTo(0, 0);
  }, [movieId]);

  const youtubeVideos = videos?.results.filter((v) => v.site === 'YouTube') ?? [];

  const releaseYear = movie?.release_date ? movie.release_date.split('-')[0]! : '';

  if (isMovieLoading) {
    return (
      <div className={styles.loading}>
        <div className="spinner" />
        <p className={styles.loadingText}>로딩 중...</p>
      </div>
    );
  }

  if (movieError || !movie) {
    return (
      <div className={styles.error}>
        <p className={styles.errorMessage}>
          {movieError instanceof Error ? movieError.message : '영화 정보를 불러오지 못했습니다.'}
        </p>
        <Link to="/">
          <button className={styles.retryButton}>홈으로 이동</button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContainer}>
        <MovieHero movie={movie} images={images} releaseYear={releaseYear} />

        <div className={styles.contentSection}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${activeTab === 'content' ? styles.active : ''}`}
              onClick={() => setActiveTab('content')}
            >
              콘텐츠 정보
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'related' ? styles.active : ''}`}
              onClick={() => setActiveTab('related')}
            >
              관련 콘텐츠
            </button>
          </div>

          {activeTab === 'content' && (
            <MovieContentTab
              youtubeVideos={youtubeVideos}
              isVideosLoading={isVideosLoading}
              credits={credits}
              isCreditsLoading={isCreditsLoading}
              currentReviews={currentReviews}
              reviewCount={reviewCount}
              isReviewsLoading={isReviewsLoading}
              hasMoreReviews={hasMoreReviews}
              fetchMoreReviews={fetchMoreReviews}
              isFetchingMoreReviews={isFetchingMoreReviews}
            />
          )}

          {activeTab === 'related' && (
            <RelatedContentTab
              similarMovies={similarMovies?.results ?? []}
              isSimilarLoading={isSimilarLoading ?? false}
            />
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <h2 className={styles.footerTitle}>{movie.title}</h2>
          <button className={styles.watchButton}>감상하기</button>
        </div>
      </footer>
    </div>
  );
};

export default MovieDetailPage;
