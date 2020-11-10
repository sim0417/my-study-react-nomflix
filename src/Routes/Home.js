import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Helmet from "react-helmet";
import Section from "Components/Section";
import Loader from "Components/Loader";
import Message from "Components/Message";
import Poster from "Components/Poster";
import { moviesApi } from "api";

const Container = styled.div`
  padding: 20px;
`;

export default () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [state, setState] = useState({
    nowPlaying: null,
    upComing: null,
    popular: null,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const {
        data: { results: nowPlaying },
      } = await moviesApi.nowPlaying();
      const {
        data: { results: upComing },
      } = await moviesApi.upComing();
      const {
        data: { results: popular },
      } = await moviesApi.popular();

      setState({
        nowPlaying,
        upComing,
        popular,
      });
    } catch (e) {
      setError("Can't find movies information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Movies | Nomflix</title>
      </Helmet>
      {loading ? (
        <Loader />
      ) : (
        <Container>
          {state.nowPlaying && state.nowPlaying.length > 0 && (
            <Section title="Now Playing">
              {state.nowPlaying.map((movie) => (
                <Poster
                  key={movie.id}
                  id={movie.id}
                  title={movie.original_title}
                  imageUrl={movie.poster_path}
                  rating={movie.vote_average}
                  year={movie.release_date.substring(0, 4)}
                  isMovie={true}
                />
              ))}
            </Section>
          )}
          {state.upComing && state.upComing.length > 0 && (
            <Section title="Upcoming Movies">
              {state.upComing.map((movie) => (
                <Poster
                  key={movie.id}
                  id={movie.id}
                  title={movie.original_title}
                  imageUrl={movie.poster_path}
                  rating={movie.vote_average}
                  year={movie.release_date.substring(0, 4)}
                  isMovie={true}
                />
              ))}
            </Section>
          )}
          {state.popular && state.popular.length > 0 && (
            <Section title="Popular Movies">
              {state.popular.map((movie) => (
                <Poster
                  key={movie.id}
                  id={movie.id}
                  title={movie.original_title}
                  imageUrl={movie.poster_path}
                  rating={movie.vote_average}
                  year={movie.release_date.substring(0, 4)}
                  isMovie={true}
                />
              ))}
            </Section>
          )}
          {error && <Message text={error} color="#e74c3c" />}
        </Container>
      )}
    </>
  );
};
