export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

export interface MovieDetail extends Movie {
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  tagline: string;
  production_companies: Array<{ name: string }>;
  vote_count: number;
}

export interface Collection {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: Movie[];
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  known_for: Array<{ title: string }>;
}

export interface PersonCredits {
  cast: Movie[];
  crew: Movie[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface GenreMap {
  [id: number]: string;
}

export interface TMDBConfiguration {
  images: {
    secure_base_url: string;
    base_url: string;
    poster_sizes: string[];
    backdrop_sizes: string[];
    profile_sizes: string[];
  };
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export type SearchResponse = MovieResponse;

export interface GenreResponse {
  genres: Genre[];
}

export interface MovieImages {
  backdrops: Array<{ file_path: string; width: number; height: number; vote_average: number }>;
  logos: Array<{ file_path: string; width: number; height: number; vote_average: number }>;
  posters: Array<{ file_path: string; width: number; height: number; vote_average: number }>;
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface MovieVideosResponse {
  id: number;
  results: MovieVideo[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

export interface MovieCreditsResponse {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface AuthorDetails {
  username: string;
  avatar_path: string | null;
  rating: number | null;
}

export interface MovieReview {
  id: string;
  author: string;
  author_details: AuthorDetails;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface MovieReviewsResponse {
  id: number;
  page: number;
  results: MovieReview[];
  total_pages: number;
  total_results: number;
}

export type SimilarMoviesResponse = MovieResponse;
