import { useRef, useState, type PropsWithChildren } from 'react';
import styles from './CarouselRow.module.css';

interface CarouselRowProps extends PropsWithChildren {
  title: string;
  description?: string;
  isLoading?: boolean;
}

const CarouselRow: React.FC<CarouselRowProps> = ({ title, description, children, isLoading = false }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth);
  };

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollBy({
      left: -container.clientWidth * 0.75,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollBy({
      left: container.clientWidth * 0.75,
      behavior: 'smooth',
    });
  };

  const childArray = Array.isArray(children) ? children : [children];
  const itemCount = childArray.length;

  if (isLoading) {
    return (
      <section className={styles.carouselRow}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <div className={styles.skeletonContainer}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={styles.skeletonCard} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.carouselRow}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>

      <div className={styles.carouselContainer}>
        {showLeftArrow && itemCount > 0 && (
          <button className={styles.scrollButton} onClick={scrollLeft} aria-label="왼쪽으로 스크롤">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        <div ref={scrollContainerRef} className={styles.scrollContainer} onScroll={handleScroll}>
          <div className={styles.content}>{children}</div>
        </div>

        {showRightArrow && itemCount > 0 && (
          <button className={styles.scrollButton} onClick={scrollRight} aria-label="오른쪽으로 스크롤">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
};

export default CarouselRow;
