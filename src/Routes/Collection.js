import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { collectionApi } from "api";

const Container = styled.div`
  padding: 20px;
  width: 100%;

  display: grid;
  align-items: center;
  grid-template-columns: repeat(5, minmax(70px, 1fr));
  grid-gap: 10px;
`;

const Collection = styled(Link)`
  height: 100%;
`;

const CollectionPoster = styled.img`
  max-width: 100%;
  border-radius: 8px;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.02);
    box-shadow: 0px 0px 5px 1px rgba(0, 142, 207, 0.8);
  }
`;

const CollectionName = styled.div`
  margin-top: 5px;
  text-align: center;
`;

export default (props) => {
  const {
    location: { pathname },
    match: {
      params: { id, colectionId },
    },
    history: { push },
  } = props;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [result, setState] = useState();

  const loadData = async () => {
    setLoading(true);
    const parsedId = parseInt(colectionId);
    if (isNaN(parsedId)) {
      return push("/");
    }
    try {
      const { data: result } = await collectionApi.collectionDetail(colectionId);
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
            result.parts &&
            result.parts.length > 0 &&
            result.parts.map((colection) => (
              <Collection to={`/movie/${colection.id}/trailers`}>
                <CollectionPoster
                  src={
                    colection.poster_path
                      ? `https://image.tmdb.org/t/p/w500${colection.poster_path}`
                      : require("../assets/noPosterSmall.png").default
                  }
                />
                <CollectionName>{`${colection.title}`}</CollectionName>
              </Collection>
            ))}
        </Container>
      )}
    </>
  );
};
