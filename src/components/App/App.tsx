// src/App.tsx

import { useState } from "react";

import { toast, Toaster } from "react-hot-toast";

import css from './App.module.css';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovie } from '../../services/movieService';
import type { Movie } from "../../types/movie";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const handleSearchSubmit = async (query: string) => {
    setMovies([]);
    
    try {
      setIsLoading(true);
      setIsError(false);

      const moviesList = await fetchMovie(query);

      if (moviesList.length === 0) {
        toast.error('No movies found for your request.');
        return;
      }

      setMovies(moviesList);
    }
    catch {
      setIsError(true);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearchSubmit} />
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
      <Toaster position="top-center" />
    </div>
  );
}