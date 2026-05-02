import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import styles from './CarouselRow.module.css';

interface CarouselRowProps extends PropsWithChildren {
  title: string;
  description?: string;
  isLoading?: boolean;
}

const CarouselRow: React.FC<CarouselRowProps> = ({ title, description, children, isLoading = false }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [skeletonCount, setSkeletonCount] = useState(3);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const updateSkeletonCount = () => {
      const columnCount = parseInt(getComputedStyle(section).getPropertyValue('--carousel-column-count').trim(), 10);
      if (!isNaN(columnCount) && columnCount > 0) {
        setSkeletonCount(columnCount);
      }
    };

    updateSkeletonCount();

    const observer = new ResizeObserver(updateSkeletonCount);
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const getCarouselItems = (container: HTMLDivElement): HTMLElement[] => {
    const content = container.firstElementChild;
    if (!(content instanceof HTMLElement)) return [];

    return Array.from(content.children).filter((element): element is HTMLElement => element instanceof HTMLElement);
  };

  const getVisibleRange = (container: HTMLDivElement, items: HTMLElement[]) => {
    const viewportLeft = container.scrollLeft;
    const viewportRight = viewportLeft + container.clientWidth;

    let firstVisibleIndex = items.findIndex((item) => item.offsetLeft + item.offsetWidth > viewportLeft + 1);
    if (firstVisibleIndex < 0) firstVisibleIndex = 0;

    let lastVisibleIndex = firstVisibleIndex;
    while (lastVisibleIndex + 1 < items.length && items[lastVisibleIndex + 1]!.offsetLeft < viewportRight - 1) {
      lastVisibleIndex += 1;
    }

    return { firstVisibleIndex, lastVisibleIndex };
  };

  const getRangeWidth = (items: HTMLElement[], firstIndex: number, lastIndex: number): number => {
    const start = items[firstIndex]!.offsetLeft;
    const end = items[lastIndex]!.offsetLeft + items[lastIndex]!.offsetWidth;

    return end - start;
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth);
  };

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const items = getCarouselItems(container);
    if (items.length === 0) return;

    const { firstVisibleIndex, lastVisibleIndex } = getVisibleRange(container, items);
    const visibleCount = lastVisibleIndex - firstVisibleIndex + 1;

    const previousLastIndex = firstVisibleIndex - 1;
    if (previousLastIndex < 0) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    const previousFirstIndex = Math.max(0, previousLastIndex - visibleCount + 1);
    const scrollAmount = getRangeWidth(items, previousFirstIndex, previousLastIndex);

    container.scrollTo({
      left: Math.max(0, container.scrollLeft - scrollAmount),
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const items = getCarouselItems(container);
    if (items.length === 0) return;

    const { firstVisibleIndex, lastVisibleIndex } = getVisibleRange(container, items);
    const scrollAmount = getRangeWidth(items, firstVisibleIndex, lastVisibleIndex);
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    container.scrollTo({
      left: Math.min(maxScrollLeft, container.scrollLeft + scrollAmount),
      behavior: 'smooth',
    });
  };

  const childArray = Array.isArray(children) ? children : [children];
  const itemCount = childArray.length;

  if (isLoading) {
    return (
      <section ref={sectionRef} className={styles.carouselRow}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <div className={styles.skeletonContainer}>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={index} className={styles.skeletonCard} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className={styles.carouselRow}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>

      <div className={styles.carouselContainer}>
        {showLeftArrow && itemCount > 0 && (
          <button className={styles.scrollButton} onClick={scrollLeft} aria-label="왼쪽으로 스크롤">
            <svg
              className={styles.scrollIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              preserveAspectRatio="none"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        <div ref={scrollContainerRef} className={styles.scrollContainer} onScroll={handleScroll}>
          <div className={styles.content}>{children}</div>
        </div>

        {showRightArrow && itemCount > 0 && (
          <button className={styles.scrollButton} onClick={scrollRight} aria-label="오른쪽으로 스크롤">
            <svg
              className={styles.scrollIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              preserveAspectRatio="none"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
};

export default CarouselRow;
