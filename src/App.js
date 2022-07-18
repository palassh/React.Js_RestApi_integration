import React, { useState, useEffect, useCallback } from "react";
import AddMovie from "./components/AddMovie";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApiHandler = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://react-http-e15fb-default-rtdb.firebaseio.com/movies.json");
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();

      const loadedMovies = []

      for (const key in data){
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        })
      }

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchApiHandler();
  }, [fetchApiHandler]);

  async function addMovieHandler(movie) {
    const response = await fetch(
      "https://react-http-e15fb-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        header: { "content-Type": "application/json" },
        body: JSON.stringify(movie),
      }
    );
    const data = await response.json();
    console.log(data);
  }

  let content = <p>Found no movies</p>;
  if (error) {
    content = <p>{error}</p>;
  }
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (loading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchApiHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
