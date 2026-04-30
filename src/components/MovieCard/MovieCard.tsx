import { getPosterUrl, formatRating } from '../../utils';
import type { Movie } from '../../types';
import styles from './MovieCard.module.css';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
  showRank?: boolean;
  rank?: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, showRank = false, rank }) => {
  const posterUrl = getPosterUrl(movie.poster_path);

  return (
    <div className={styles.movieCard} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.posterWrapper}>
        {showRank && rank && <div className={styles.rank}>{rank}</div>}
        <img src={posterUrl} alt={movie.title} className={styles.poster} loading="lazy" />
        <div className={styles.overlay}>
          <div className={styles.rating}>
            <span className={styles.star}>★</span>
            {formatRating(movie.vote_average)}
          </div>
        </div>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{movie.title}</h3>
        <p className={styles.year}>{movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</p>
      </div>
    </div>
  );
};

export default MovieCard;
