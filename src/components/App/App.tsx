// src/App.tsx

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast, Toaster } from "react-hot-toast";

import css from './App.module.css';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import ReactPagination from '../ReactPaginate/ReactPaginate';
import { fetchMovie } from '../../services/movieService';
import type { Movie } from "../../types/movie";

export default function App() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', searchQuery, page],
    queryFn: async () => {
      const response = await fetchMovie(searchQuery, page);
      if (response.results.length === 0) {
        toast.error('No movies found for your request.');
      }
      return response;
    },
    enabled: searchQuery !== "",
  });

  const movies = data?.results || [];
  const totalPages = data?.total_page || 0;

  console.log("Отримані дані з бекенду (data):", data);
  console.log("Кількість сторінок (totalPages):", totalPages);

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setPage(1);
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
      {totalPages > 1 && !isLoading && (
        <ReactPagination 
          totalPages={totalPages} 
          page={page} 
          setPage={setPage} 
        />
      )}
      <Toaster position="top-center" />
    </div>
  );
}