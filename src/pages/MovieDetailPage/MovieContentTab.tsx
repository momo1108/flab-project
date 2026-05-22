import { useRef, useEffect } from 'react';
import type { MovieVideo, MovieCreditsResponse, MovieReview, CastMember, CrewMember } from '../../types/tmdb';
import { getImageUrl, getProfileUrl } from '../../utils/image';
import styles from './MovieDetailPage.module.css';

interface MovieContentTabProps {
  youtubeVideos: MovieVideo[];
  isVideosLoading: boolean;
  credits: MovieCreditsResponse | undefined;
  isCreditsLoading: boolean;
  currentReviews: MovieReview[];
  reviewCount: number;
  isReviewsLoading: boolean;
  loadMoreReviews: () => void;
}

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

export const MovieContentTab: React.FC<MovieContentTabProps> = ({
  youtubeVideos,
  isVideosLoading,
  credits,
  isCreditsLoading,
  currentReviews,
  reviewCount,
  isReviewsLoading,
  loadMoreReviews,
}) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const producer: CrewMember | undefined =
    credits?.crew.find((c) => c.job === 'Executive Producer') ?? credits?.crew.find((c) => c.job === 'Producer');

  const topCast = credits?.cast.sort((a, b) => a.order - b.order).slice(0, 10);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (currentReviews.length >= reviewCount || isReviewsLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMoreReviews();
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
  }, [currentReviews, isReviewsLoading, loadMoreReviews]);

  return (
    <div className={`${styles.tabContent} ${styles.active}`}>
      {youtubeVideos.length > 0 && (
        <div className={styles.subsection}>
          <h2 className={styles.sectionTitle}>관련 동영상</h2>
          {isVideosLoading ? (
            <div className={styles.loading}>
              <div className="spinner" />
              <p className={styles.loadingText}>로딩 중...</p>
            </div>
          ) : (
            <div className={styles.videosGrid}>
              {youtubeVideos.slice(0, 4).map((video) => (
                <a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.videoCard}
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                    alt={video.name}
                    className={styles.videoThumbnail}
                  />
                  <div className={styles.playOverlay}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="5 3 11 8 5 13 5 3" />
                    </svg>
                  </div>
                  <div className={styles.videoName}>{video.name}</div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={styles.subsection}>
        <h2 className={styles.sectionTitle}>감독/출연</h2>
        {isCreditsLoading ? (
          <div className={styles.loading}>
            <div className="spinner" />
            <p className={styles.loadingText}>로딩 중...</p>
          </div>
        ) : producer || topCast?.length ? (
          <div className={styles.castGrid}>
            {producer && (
              <div className={styles.castCard}>
                <img
                  src={getProfileUrl(producer.profile_path, 'w185')}
                  onError={(e) => {
                    e.currentTarget.src = '/default-avatar.png';
                  }}
                  alt={producer.name}
                  className={styles.castProfileImage}
                />
                <div className={styles.castInfo}>
                  <span className={styles.castName}>{producer.name}</span>
                  <span className={styles.castRole}>감독</span>
                </div>
              </div>
            )}
            {topCast?.map((person: CastMember) => (
              <div key={person.id} className={styles.castCard}>
                <img
                  src={getProfileUrl(person.profile_path, 'w185')}
                  onError={(e) => {
                    e.currentTarget.src = '/default-avatar.png';
                  }}
                  alt={person.name}
                  className={styles.castProfileImage}
                />
                <div className={styles.castInfo}>
                  <span className={styles.castName}>{person.name}</span>
                  <span className={styles.castRole}>배우 {person.character}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>감독/배우 정보가 없습니다.</p>
        )}
      </div>

      <div className={styles.subsection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>사용자 평</h2>
          <span>{reviewCount}</span>
        </div>
        {isReviewsLoading && currentReviews.length === 0 ? (
          <div className={styles.loading}>
            <div className="spinner" />
            <p className={styles.loadingText}>로딩 중...</p>
          </div>
        ) : currentReviews.length === 0 ? (
          <p className={styles.emptyState}>리뷰가 없습니다.</p>
        ) : (
          <div className={styles.reviewsList}>
            {currentReviews.map((review) => (
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
            {currentReviews.length < reviewCount && (
              <div ref={loadMoreRef}>
                {isReviewsLoading && (
                  <div className={styles.loading}>
                    <div className="spinner" />
                    <p className={styles.loadingText}>로딩 중...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
