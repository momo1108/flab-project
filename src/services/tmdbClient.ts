import type {
  MovieDetail,
  MovieResponse,
  Collection,
  Person,
  PersonCredits,
  TMDBConfiguration,
  GenreResponse,
  SearchResponse,
} from '../types';

const BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const ACCESS_TOKEN = process.env.TMDB_API_KEY;

if (!ACCESS_TOKEN) {
  throw new Error('TMDB_API_KEY is not defined in environment variables');
}

class TMDBClient {
  private baseUrl: string;
  private accessToken: string;

  constructor(baseUrl: string, accessToken: string) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Configuration
  async getConfiguration(): Promise<TMDBConfiguration> {
    return this.request<TMDBConfiguration>('/configuration');
  }

  // Genres
  async getMovieGenres(): Promise<GenreResponse> {
    return this.request<GenreResponse>('/genre/movie/list');
  }

  // Movies
  async getPopularMovies(page: number = 1): Promise<MovieResponse> {
    return this.request<MovieResponse>(`/movie/popular?page=${page}`);
  }

  async getTrendingMovies(timeWindow: 'day' | 'week' = 'day'): Promise<MovieResponse> {
    return this.request<MovieResponse>(`/trending/movie/${timeWindow}`);
  }

  async discoverMovies(params: {
    page?: number;
    with_genres?: string;
    with_keywords?: string;
    sort_by?: string;
  }): Promise<MovieResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
    return this.request<MovieResponse>(`/discover/movie?${queryParams.toString()}`);
  }

  async getMovieDetail(id: number): Promise<MovieDetail> {
    return this.request<MovieDetail>(`/movie/${id}`);
  }

  async searchMovies(query: string, page: number = 1): Promise<SearchResponse> {
    return this.request<SearchResponse>(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
  }

  // Collections
  async searchCollections(query: string, page: number = 1): Promise<{ results: Collection[] }> {
    return this.request(`/search/collection?query=${encodeURIComponent(query)}&page=${page}`);
  }

  async getCollectionDetail(id: number): Promise<Collection> {
    return this.request<Collection>(`/collection/${id}`);
  }

  // Persons
  async getPopularPersons(page: number = 1): Promise<{ results: Person[] }> {
    return this.request(`/person/popular?page=${page}`);
  }

  async getPersonMovieCredits(personId: number): Promise<PersonCredits> {
    return this.request<PersonCredits>(`/person/${personId}/movie_credits`);
  }
}

// Singleton instance
export const tmdbClient = new TMDBClient(BASE_URL, ACCESS_TOKEN);
