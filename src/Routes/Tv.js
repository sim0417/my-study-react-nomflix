import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Helmet from "react-helmet";
import Section from "Components/Section";
import Loader from "Components/Loader";
import Message from "Components/Message";
import Poster from "Components/Poster";
import { tvApi } from "api";

const Container = styled.div`
  padding: 20px;
`;

export default () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [state, setState] = useState({
    topRated: null,
    popular: null,
    airingToday: null,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const {
        data: { results: topRated },
      } = await tvApi.topRated();
      const {
        data: { results: popular },
      } = await tvApi.popular();
      const {
        data: { results: airingToday },
      } = await tvApi.airingToday();

      setState({
        topRated,
        popular,
        airingToday,
      });
    } catch (e) {
      setError("Can't find TV information.");
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
        <title>TV Show | Nomflix</title>
      </Helmet>
      {loading ? (
        <Loader />
      ) : (
        <Container>
          {state.topRated && state.topRated.length > 0 && (
            <Section title="Top Rated Shows">
              {state.topRated.map((show) => (
                <Poster
                  key={show.id}
                  id={show.id}
                  title={show.original_name}
                  imageUrl={show.poster_path}
                  rating={show.vote_average}
                  year={show.first_air_date.substring(0, 4)}
                  isMovie={false}
                />
              ))}
            </Section>
          )}
          {state.popular && state.popular.length > 0 && (
            <Section title="Popular Shows">
              {state.popular.map((show) => (
                <Poster
                  key={show.id}
                  id={show.id}
                  title={show.original_name}
                  imageUrl={show.poster_path}
                  rating={show.vote_average}
                  year={show.first_air_date.substring(0, 4)}
                  isMovie={false}
                />
              ))}
            </Section>
          )}
          {state.airingToday && state.airingToday.length > 0 && (
            <Section title="Airing Today">
              {state.airingToday.map((show) => (
                <Poster
                  key={show.id}
                  id={show.id}
                  title={show.original_name}
                  imageUrl={show.poster_path}
                  rating={show.vote_average}
                  year={show.first_air_date.substring(0, 4)}
                  isMovie={false}
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
