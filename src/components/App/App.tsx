import { useState } from "react";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const handleSubmit = async (query: string) => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await fetchMovies(query);
      setMovies(data);
      if (!data.length) {
        toast.error("No movies found for your request.");
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  const handleClick = (movie: Movie) => {
    setMovie(movie);
  };
  const handleClose = () => {
    setMovie(null);
  };
  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSubmit} />
      {movies.length > 0 && (
        <MovieGrid onSelect={handleClick} movies={movies} />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      { movie && (
        <MovieModal movie={movie} onClose={handleClose} />
      )}

      <Toaster />
    </div>
  );
}