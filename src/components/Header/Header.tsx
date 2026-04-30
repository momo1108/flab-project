import { Link } from 'react-router';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          FLAB
        </Link>
        <nav className={styles.nav}>
          <button className={styles.searchButton} aria-label="검색">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
