import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { moviesApi, tvApi } from "api";

const Container = styled.div`
  padding: 20px;
  width: 100%;
`;

const Credits = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 15px;

  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

const Person = styled.div``;

const PersonProfile = styled.img`
  max-width: 100%;
  border-radius: 8px;
  cursor: pointer;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0px 0px 5px 1px rgba(0, 142, 207, 0.8);
  }
`;

const PersonName = styled.div`
  margin-top: 5px;
  text-align: center;
`;

export default (props) => {
  const {
    location: { pathname },
    match: {
      params: { id },
    },
    history: { push },
  } = props;

  const isMovie = pathname.includes("/movie/");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [credits, setState] = useState();

  const loadData = async () => {
    setLoading(true);
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return push("/");
    }

    let creditsData = null;

    try {
      if (isMovie) {
        ({ data: creditsData } = await moviesApi.credits(parsedId));
      } else {
        ({ data: creditsData } = await tvApi.credits(parsedId));
      }

      if (creditsData.crew && creditsData.crew.length > 0) {
        creditsData.crew = getUniqueObjectArray(creditsData.crew, "name");
        creditsData.crew = creditsData.crew.slice(0, 6);
      }

      if (creditsData.cast && creditsData.cast.length > 0) {
        creditsData.cast = creditsData.cast.slice(0, 6);
      }

      setState(creditsData);
    } catch (e) {
      setError("Can't find information.");
    } finally {
      setLoading(false);
    }
  };

  function getUniqueObjectArray(array, key) {
    return array.filter((firstItem, i) => {
      return (
        array.findIndex((secondItem) => {
          return firstItem[key] === secondItem[key];
        }) === i
      );
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      {!loading && (
        <Container>
          <Credits>
            {credits.cast &&
              credits.cast.length > 0 &&
              credits.cast.map(
                (person, index) =>
                  person.profile_path && (
                    <Person key={`${index}${person.id}`}>
                      <PersonProfile src={`https://image.tmdb.org/t/p/w500${person.profile_path}`} />
                      <PersonName>{person.name}</PersonName>
                    </Person>
                  ),
              )}
          </Credits>
          <Credits>
            {credits.crew &&
              credits.crew.length > 0 &&
              credits.crew.map(
                (person, index) =>
                  person.profile_path && (
                    <Person key={`${index}${person.id}`}>
                      <PersonProfile src={`https://image.tmdb.org/t/p/w500${person.profile_path}`} />
                      <PersonName>{person.name}</PersonName>
                    </Person>
                  ),
              )}
          </Credits>
        </Container>
      )}
    </>
  );
};
