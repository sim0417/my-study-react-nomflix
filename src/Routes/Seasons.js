import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { tvApi } from "api";

const Container = styled.div`
  padding: 20px;
  width: 100%;

  display: grid;
  align-items: center;
  grid-template-columns: repeat(5, minmax(70px, 1fr));
  grid-gap: 10px;
`;

const Season = styled.div`
  height: 100%;
`;

const SeasonPoster = styled.img`
  max-width: 100%;
  border-radius: 8px;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.02);
    box-shadow: 0px 0px 5px 1px rgba(0, 142, 207, 0.8);
  }
`;

const SeasonName = styled.div`
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [result, setState] = useState();

  const loadData = async () => {
    setLoading(true);
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return push("/");
    }
    try {
      const { data: result } = await tvApi.showDetail(parsedId);
      console.log(result);
      setState(result);
    } catch (e) {
      setError("Can't find information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      {!loading && (
        <Container>
          {result &&
            result.seasons &&
            result.seasons.length > 0 &&
            result.seasons.map((season) => (
              <Season>
                <SeasonPoster
                  src={
                    season.poster_path
                      ? `https://image.tmdb.org/t/p/w500${season.poster_path}`
                      : require("../assets/noPosterSmall.png").default
                  }
                />
                <SeasonName>{`${season.name}`}</SeasonName>
              </Season>
            ))}
        </Container>
      )}
    </>
  );
};
