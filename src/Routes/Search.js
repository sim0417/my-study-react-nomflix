import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Helmet from "react-helmet";
import Section from "Components/Section";
import Loader from "Components/Loader";
import Message from "Components/Message";
import Poster from "Components/Poster";
import { moviesApi, tvApi } from "api";

const Container = styled.div`
  padding: 20px;
`;

const Form = styled.form`
  margin-bottom: 50px;
  width: 100%;
`;

const Input = styled.input`
  all: unset;
  font-size: 28px;
  width: 100%;
`;

export default () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [search, setSearchTerm] = useState({
    searchTerm: "",
    previousTerm: "",
  });

  const [state, setState] = useState({
    movieResults: null,
    tvResults: null,
  });

  const updateTerm = (event) => {
    const {
      target: { value },
    } = event;
    setSearchTerm({ ...search, searchTerm: value });
  };

  const handleSubmit = (evnet) => {
    evnet.preventDefault();
    searchByTerm();
  };

  const searchByTerm = async () => {
    setLoading(true);
    setSearchTerm({ ...search, previousTerm: "" });
    const { searchTerm } = search;
    console.log("search :", search);
    try {
      const {
        data: { results: movieResults },
      } = await moviesApi.search(searchTerm);

      const {
        data: { results: tvResults },
      } = await tvApi.search(searchTerm);

      setState({
        movieResults,
        tvResults,
      });
    } catch (e) {
      setError("Can't find results.");
    } finally {
      setLoading(false);
      setSearchTerm({ searchTerm: "", previousTerm: searchTerm });
    }
  };

  return (
    <Container>
      <Helmet>
        <title>Search | Nomflix</title>
      </Helmet>
      <Form onSubmit={handleSubmit}>
        <Input
          placeholder="Search Movies or TV Shows..."
          value={search.searchTerm}
          onChange={updateTerm}
        />
      </Form>
      {loading ? (
        <Loader />
      ) : (
        <>
          {state.movieResults && state.movieResults.length > 0 && (
            <Section title="Movie Results">
              {state.movieResults.map((movie) => (
                <Poster
                  key={movie.id}
                  id={movie.id}
                  title={movie.original_title}
                  imageUrl={movie.poster_path}
                  rating={movie.vote_average}
                  year={movie.release_date ? movie.release_date.substring(0, 4) : ""}
                  isMovie={true}
                />
              ))}
            </Section>
          )}
          {state.tvResults && state.tvResults.length > 0 && (
            <Section title="TV Show Results">
              {state.tvResults.map((show) => (
                <Poster
                  key={show.id}
                  id={show.id}
                  title={show.original_name}
                  imageUrl={show.poster_path}
                  rating={show.vote_average}
                  year={show.first_air_date ? show.first_air_date.substring(0, 4) : ""}
                  isMovie={false}
                />
              ))}
            </Section>
          )}
        </>
      )}
      {error && <Message text={error} color="#e74c3c" />}
      {state.movieResults &&
        state.movieResults.length === 0 &&
        state.tvResults &&
        state.tvResults.length === 0 &&
        search.previousTerm && (
          <Message text={`Nothing found "${search.previousTerm}"`} color="#95a5a6" />
        )}
    </Container>
  );
};
