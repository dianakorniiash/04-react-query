import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { useQuery } from "@tanstack/react-query";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import css from "./App.module.css";

interface MovieResponse {
  results: Movie[];
  total_pages: number;
}

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const openModal = (movie: Movie) => setSelectedMovie(movie);
  const closeModal = () => setSelectedMovie(null);

  const { data, isSuccess, isLoading, isError } = useQuery<MovieResponse>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
  });

  const handleSearch = (movie: string) => {
    setQuery(movie);
    setPage(1);
  };

  const totalPages = data?.total_pages ?? 0;

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
          onPageChange={({ selected }) => setPage(selected + 1)}
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
