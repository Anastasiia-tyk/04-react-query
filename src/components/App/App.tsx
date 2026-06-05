// src/App.tsx

import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from '@tanstack/react-query';
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
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: ['movies', searchQuery, currentPage],
    queryFn: () => fetchMovie(searchQuery, currentPage),
    enabled: searchQuery !== '',
    placeholderData: keepPreviousData,
  });
  
  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  useEffect(() => {
    if (searchQuery !== "" && !isLoading && !isPlaceholderData && data?.results?.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [data, isLoading, isPlaceholderData, searchQuery]);

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const handleSearchSubmit = async (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handlePageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearchSubmit} />
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}
      {isLoading && !isPlaceholderData && <Loader />}
      {isError && <ErrorMessage />}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
      {totalPages > 1 && (
        <ReactPagination
          pageCount={totalPages}
          forcePage={currentPage}
          onPageChange={handlePageChange} 
        />
      )}
      <Toaster position="top-center" />
    </div>
  );
}