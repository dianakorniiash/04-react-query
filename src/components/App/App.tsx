import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { useQuery } from "@tanstack/react-query";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import css from "./App.module.css";

// Интерфейс ответа от TMDB
interface MovieResponse {
  results: Movie[];
  total_pages: number;
}

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const openModal = (movie: Movie) => setSelectedMovie(movie);
  const closeModal = () => setSelectedMovie(null);

  // React Query с серверной пагинацией
  const { data, isSuccess, isLoading, isError } = useQuery<MovieResponse>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim() !== "",
    keepPreviousData: true,
  });

  const totalPages = data?.total_pages ?? 0;

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim() === "") {
      toast.error("Please enter a search term.");
      return;
    }
    setQuery(searchQuery);
    setPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  // Уведомление, если фильмы не найдены
  useEffect(() => {
    if (query && !isLoading && !isError && data?.results?.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [query, isLoading, isError, data]);

  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />

      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {data?.results && data.results.length > 0 && (
        <MovieGrid onSelect={openModal} movies={data.results} />
      )}

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal} />}
    </div>
  );
}
