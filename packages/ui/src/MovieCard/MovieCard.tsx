import styles from "./MovieCard.module.css";

export interface MovieCardProps {
  title: string;
  posterUrl: string;
  voteAverage: number;
  releaseDate: string;
  onClick?: () => void;
  rank?: number | undefined;
}

const formatRating = (rating: number): string => {
  return (rating * 10).toFixed(1);
};

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  posterUrl,
  voteAverage,
  releaseDate,
  onClick,
  rank,
}) => {
  return (
    <div
      className={styles.movieCard}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className={styles.posterWrapper}>
        {rank !== undefined && <div className={styles.rank}>{rank}</div>}
        <img
          src={posterUrl}
          alt={title}
          className={styles.poster}
          loading="lazy"
        />
        <div className={styles.overlay}>
          <div className={styles.rating}>
            <span className={styles.star}>★</span>
            {formatRating(voteAverage)}
          </div>
        </div>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.year}>
          {releaseDate ? releaseDate.substring(0, 4) : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
