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
