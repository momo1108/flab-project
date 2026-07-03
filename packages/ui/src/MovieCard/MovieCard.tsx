import styles from "./MovieCard.module.css";

export interface MovieCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  posterUrl: string;
  voteAverage: number;
  releaseDate: string;
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
  rank,
  ...rest
}) => {
  return (
    <div className={styles.movieCard} role="button" tabIndex={0} {...rest}>
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
