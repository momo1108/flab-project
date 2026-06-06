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

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
}

export const tmdbClient = new TMDBClient(BASE_URL, ACCESS_TOKEN);
