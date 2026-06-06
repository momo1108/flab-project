import { useRef, useEffect } from 'react';
import { useParams } from 'react-router';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { movieReviewsQuery } from '../../../../services/tmdb/tmdbMovies';
import { useImageUrls } from '../../../../hooks/useImageUrls';
import styles from '../../MovieDetailPage.module.css';
import type { MovieReview } from '../../../../types/tmdb';

const renderStars = (rating: number | null): React.ReactElement[] => {
  if (rating === null) return [];
  const stars = Math.floor(rating / 2);

  return Array.from({ length: 5 }, (_, i) => (
    <svg
      key={i}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill={i < stars ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="7 1 9 5 13 5 10 8 11 12 7 10 3 12 4 8 1 5 5 5 7 1" />
    </svg>
  ));
};

export const ReviewsSubsection = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id ? Number.parseInt(id, 10) : 0;
  const { getImageUrl } = useImageUrls();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data: reviewsData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(movieReviewsQuery(movieId, true));

  const allReviews = reviewsData.pages.reduce<MovieReview[]>((acc, page) => [...acc, ...page.results], []);
  const reviewCount = reviewsData.pages[0]?.total_results ?? 0;

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px', threshold: 0.1 },
    );

    const target = loadMoreRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (allReviews.length === 0) {
    return <p className={styles.emptyState}>리뷰가 없습니다.</p>;
  }

  return (
    <>
      <div className={styles.reviewsHeader}>
        <span>평가 인원</span>
        <span className={styles.reviewCountSpan}>{reviewCount}</span>
      </div>
      <div className={styles.reviewsList}>
        {allReviews.map((review) => (
          <div key={review.id} className={styles.reviewCard}>
            <img
              src={
                review.author_details.avatar_path
                  ? getImageUrl(review.author_details.avatar_path, 'profile', 'w185')
                  : '/default-avatar.png'
              }
              alt={review.author}
              className={styles.reviewAvatar}
            />
            <div className={styles.reviewInfo}>
              <div className={styles.reviewHeader}>
                <span className={styles.reviewUsername}>{review.author_details.username || review.author}</span>
                {review.author_details.rating !== null && (
                  <div className={styles.reviewRating}>
                    <span>{review.author_details.rating}</span>
                    {renderStars(review.author_details.rating)}
                  </div>
                )}
              </div>
              <p className={styles.reviewText}>{review.content}</p>
            </div>
          </div>
        ))}
        {hasNextPage && (
          <div ref={loadMoreRef}>
            {isFetchingNextPage && (
              <div className={styles.loading}>
                <div className="spinner" />
                <p className={styles.loadingText}>로딩 중...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
