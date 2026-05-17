import styles from './SearchPage.module.css';

interface SearchInputSectionProps {
  searchQuery: string;
  onInputChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export const SearchInputSection: React.FC<SearchInputSectionProps> = ({ searchQuery, onInputChange, onClear }) => {
  return (
    <div className={styles.searchSection}>
      <div className={styles.searchInputWrapper}>
        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={onInputChange}
        />
        <button className={`${styles.clearButton} ${searchQuery ? styles.visible : ''}`} onClick={onClear}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
