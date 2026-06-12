import { useState, useEffect, startTransition } from 'react';
import styles from './SearchPage.module.css';
import { SearchInputSection } from './sections/SearchInputSection';
import { PopularTop10 } from './sections/PopularTop10';
import { SearchResults } from './sections/SearchResults';
import { BackdropSlideshow } from './sections/BackdropSlideshow';
import { GenreSections } from './sections/GenreSections';

const SearchPage: React.FC = () => {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query (1 second)
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        setDebouncedQuery(searchQuery.trim());
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className={styles.pageContainer}>
      {/* Search Input Section */}
      <SearchInputSection searchQuery={searchQuery} onInputChange={handleInputChange} onClear={handleClear} />

      {/* Content Layout */}
      <div className={styles.contentLayout}>
        <div className={styles.contentMain}>
          {!debouncedQuery ? <PopularTop10 /> : <SearchResults searchQuery={debouncedQuery} />}
        </div>

        {/* Backdrop Slideshow (1280px+ only) */}
        {!debouncedQuery && <BackdropSlideshow />}
      </div>

      {/* Random Genre Sections */}
      <GenreSections />
    </div>
  );
};

export default SearchPage;
