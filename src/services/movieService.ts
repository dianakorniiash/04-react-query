import axios from "axios";
import type { Movie } from "../types/movie";

export interface MovieResponse {
  results: Movie[];
  total_pages: number;
}

const MY_TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const API_URL = "https://api.themoviedb.org/3/search/movie";

export async function fetchMovies(
  query: string,
  page: number
): Promise<MovieResponse> {
  const response = await axios.get<MovieResponse>(API_URL, {
    params: { query, page },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${MY_TMDB_TOKEN}`,
    },
  });

  return response.data;
}
