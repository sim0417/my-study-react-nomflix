import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { moviesApi, tvApi } from "api";

const Container = styled.div`
  padding: 20px;
  width: 100%;

  display: grid;
  align-items: center;
  grid-template-columns: repeat(4, minmax(70px, 1fr));
  grid-gap: 10px;
`;

const Production = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;

const ProductionLogo = styled.img`
  max-width: 100%;
  max-height: 100px;
`;

const ProductionName = styled.div`
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
  const [result, setState] = useState();

  const loadData = async () => {
    setLoading(true);
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return push("/");
    }

    let defaulData = null;

    try {
      if (isMovie) {
        ({ data: defaulData } = await moviesApi.movieDetail(parsedId));
      } else {
        ({ data: defaulData } = await tvApi.showDetail(parsedId));
      }

      setState(defaulData);
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
          {result.production_companies &&
            result.production_companies.length > 0 &&
            result.production_companies.map((production) => (
              <Production>
                <ProductionLogo
                  src={
                    production.logo_path
                      ? `https://image.tmdb.org/t/p/w500${production.logo_path}`
                      : require("../assets/noPosterSmall.png").default
                  }
                />
                <ProductionName>{production.name}</ProductionName>
              </Production>
            ))}
        </Container>
      )}
    </>
  );
};
