// src/services/moviesService.ts

import axios from "axios";
import type { Movie } from "../types/movie";

interface MovieHttpResponse {
    results: Movie[];
}

export const fetchMovie = async (query: string): Promise<Movie[]> => {
    const token = import.meta.env.VITE_TMDB_TOKEN;

    const response = await axios.get<MovieHttpResponse>(
        `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&query=${query}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    );
    return response.data.results;
};