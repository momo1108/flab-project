import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import {
  useMovieDetail,
  useMovieImages,
  useMovieVideos,
  useMovieCredits,
  useMovieReviews,
  useSimilarMovies,
} from '../../hooks/useTMDB';
import styles from './MovieDetailPage.module.css';
import type { MovieReview } from '../../types/tmdb';
import { MovieHero } from './MovieHero';
import { MovieContentTab } from './MovieContentTab';
import { RelatedContentTab } from './RelatedContentTab';

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id ? Number.parseInt(id, 10) : 0;

  const [activeTab, setActiveTab] = useState<'content' | 'related'>('content');
  const [reviewPage, setReviewPage] = useState(1);
  const [allReviews, setAllReviews] = useState<MovieReview[]>([]);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);

  const { data: movie, isLoading: isMovieLoading, error: movieError } = useMovieDetail(movieId);
  const { data: images } = useMovieImages(movieId);
  const { data: videos, isLoading: isVideosLoading } = useMovieVideos(movieId);
  const { data: credits, isLoading: isCreditsLoading } = useMovieCredits(movieId);
  const { data: reviews, isLoading: isReviewsLoading } = useMovieReviews(movieId, reviewPage, activeTab === 'content');
  const { data: similarMovies, isLoading: isSimilarLoading } = useSimilarMovies(movieId, 1, activeTab === 'related');

  useEffect(() => {
    if (reviews && activeTab === 'content') {
      if (reviewPage === 1) {
        setAllReviews(reviews.results);
      } else {
        setAllReviews((prev) => [...prev, ...reviews.results]);
      }
      setHasMoreReviews(reviews.page < reviews.total_pages);
    }
  }, [reviews, reviewPage, activeTab]);

  useEffect(() => {
    if (activeTab === 'content') {
      setReviewPage(1);
      setAllReviews([]);
    }
  }, [activeTab, movieId]);

  // Reset state when movieId changes
  useEffect(() => {
    setActiveTab('content');
    setReviewPage(1);
    setAllReviews([]);
    setHasMoreReviews(true);
    window.scrollTo(0, 0);
  }, [movieId]);

  const loadMoreReviews = () => {
    if (hasMoreReviews) setReviewPage((prev) => prev + 1);
  };

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
              allReviews={allReviews}
              isReviewsLoading={isReviewsLoading}
              reviewPage={reviewPage}
              hasMoreReviews={hasMoreReviews}
              loadMoreReviews={loadMoreReviews}
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
