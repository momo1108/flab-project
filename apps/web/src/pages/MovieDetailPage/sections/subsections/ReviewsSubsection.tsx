import { useParams } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { movieReviewsQuery } from '@/services/tmdb/queries/movie';
import styles from '../../MovieDetailPage.module.css';
import type { MovieReview } from '@/types/tmdb';
import { getProfileUrl } from '@/services/tmdb/imageUrls';
import { configurationQueryObj } from '@/services/tmdb/queries/configuration';
import SectionWrapper from '@/components/SectionWrapper';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Image } from '@flab/ui';

export const ReviewsSubsection = () => {
  const { movieId: id } = useParams({ from: '/movie/$movieId' });

  return (
    <div className={styles.subsection}>
      <h2 className={styles.sectionTitle}>사용자 평</h2>
      <SectionWrapper resetKeys={[id]}>
        <ReviewsSubsectionContent />
      </SectionWrapper>
    </div>
  );
};

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

const ReviewsSubsectionContent = () => {
  const { movieId: id } = useParams({ from: '/movie/$movieId' });
  const movieId = id ? Number.parseInt(id, 10) : 0;

  const { data: config } = useSuspenseQuery(configurationQueryObj);
  const {
    data: reviewsData,
    hasNextPage,
    isFetchingNextPage,
    loadMoreRef,
  } = useInfiniteScroll(movieReviewsQuery(movieId, true), { rootMargin: '200px' });

  const allReviews = reviewsData.pages.reduce<MovieReview[]>((acc, page) => [...acc, ...page.results], []);
  const reviewCount = reviewsData.pages[0]?.total_results ?? 0;

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
            <Image
              src={getProfileUrl(review.author_details.avatar_path, config, 'w185', 'default-avatar.png')}
              alt={review.author}
              className={styles.reviewAvatar}
              fallbackSrc="/default-avatar.png"
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
