import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import {
  useMovieDetail,
  useMovieImages,
  useMovieVideos,
  useMovieCredits,
  useMovieReviews,
  useSimilarMovies,
  useTMDBConfiguration,
} from '../../hooks/useTMDB';
import styles from './MovieDetailPage.module.css';
import type { MovieReview } from '../../types/tmdb';
import { MovieHero } from './MovieHero';
import { MovieContentTab } from './MovieContentTab';
import { RelatedContentTab } from './RelatedContentTab';
import { setImageConfig } from '../../utils/image';

const MovieDetailPage = () => {
  // API Configuration
  const { data: config } = useTMDBConfiguration();

  // Initialize image config
  useEffect(() => {
    if (config?.images) {
      setImageConfig(config.images);
    }
  }, [config]);

  const { id } = useParams<{ id: string }>();
  const movieId = id ? Number.parseInt(id, 10) : 0;

  const [activeTab, setActiveTab] = useState<'content' | 'related'>('content');
  const [currentReviews, setCurrentReviews] = useState<MovieReview[]>([]);

  const { data: movie, isLoading: isMovieLoading, error: movieError } = useMovieDetail(movieId);
  const { data: images } = useMovieImages(movieId);
  const { data: videos, isLoading: isVideosLoading } = useMovieVideos(movieId);
  const { data: credits, isLoading: isCreditsLoading } = useMovieCredits(movieId);
  const { data: reviews, isLoading: isReviewsLoading } = useMovieReviews(movieId, 1, activeTab === 'content');
  const { data: similarMovies, isLoading: isSimilarLoading } = useSimilarMovies(movieId, 1, activeTab === 'related');

  useEffect(() => {
    if (reviews && activeTab === 'content') {
      if (currentReviews.length === 0) {
        setCurrentReviews(reviews.results.slice(0, 10));
      }
    }
  }, [reviews, activeTab]);

  useEffect(() => {
    if (activeTab === 'content') {
      setCurrentReviews([]);
    }
  }, [activeTab, movieId]);

  // Reset state when movieId changes
  useEffect(() => {
    setActiveTab('content');
    setCurrentReviews([]);
    window.scrollTo(0, 0);
  }, [movieId]);

  const loadMoreReviews = () => {
    if (!reviews) return;
    if (currentReviews.length < reviews.results.length) {
      setCurrentReviews((currentReviews) => reviews.results.slice(0, currentReviews.length + 10));
    }
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
              currentReviews={currentReviews}
              reviewCount={reviews?.results.length || 0}
              isReviewsLoading={isReviewsLoading}
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
