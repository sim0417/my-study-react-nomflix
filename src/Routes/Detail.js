import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Helmet from "react-helmet";
import Loader from "Components/Loader";
import Trailers from "./Trailers";
import Cast from "./Cast";
import Production from "./Production";
import Collection from "./Collection";
import Seasons from "./Seasons";
import { moviesApi, tvApi } from "api";
import { Route, Link } from "react-router-dom";

const Container = styled.div`
  padding: 50px;
  width: 100%;
  height: calc(100vh - 50px);
  position: relative;
`;

const BackDrop = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.bgUrl});
  background-position: center center;
  background-size: cover;
  filter: blur(3px);
  opacity: 0.5;

  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  z-index: 1;
`;

const Cover = styled.div`
  width: 30%;
  height: 100%;
  border-radius: 4px;
  background-image: url(${(porps) => porps.bgUrl});
  background-position: center center;
  background-size: cover;
`;

const Data = styled.div`
  width: 70%;
  padding: 20px;
  margin-left: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 6px;

  display: grid;
  grid-template-rows: 40% 60%;
`;

const DataRow = styled.div`
  height: 100%;
  overflow-y: auto;
`;

const Title = styled.h3`
  font-size: 32px;
  margin-bottom: 30px;
`;

const ImdbLink = styled.a`
  padding: 2px 6px;
  margin-left: 15px;
  background-color: rgb(245, 197, 24);
  color: black;
  font-weight: 700;
  font-size: 16px;
  border-radius: 8px;
  transition: background-color 0.3s linear;

  &::after {
    content: "IMDB";
  }

  &:hover {
    background-color: rgb(252 218 76);
  }
`;

const ItemContainer = styled.div`
  margin: 20px 0px;
`;

const Item = styled.span``;

const Divider = styled.span`
  margin: 0 10px;
`;

const Overview = styled.p`
  font-size: 12px;
  opacity: 0.8;
  line-height: 1.5;
  width: 100%;
`;

const InfoTabs = styled.div`
  display: flex;
`;

const Tab = styled(Link)`
  padding: 10px 20px;
  font-size: 17px;
  color: ${(props) => (props.active ? "#3498db" : "white")};
  font-weight: ${(props) => (props.active ? "600" : "300")};
  border-bottom: ${(props) => (props.active ? "3px solid #3498db" : "none")};

  cursor: pointer;

  &:hover {
    /* border-bottom: 3px solid #3498db; */
    color: #7fcafc;
  }
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
  const baseUrl = isMovie ? `/movie` : `/show`;
  const contentIdUrl = `${baseUrl}/${id}`;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [result, setState] = useState();

  const loadData = async () => {
    setLoading(true);

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return push("/");
    }

    let result = null;

    try {
      if (isMovie) {
        ({ data: result } = await moviesApi.movieDetail(parsedId));
      } else {
        ({ data: result } = await tvApi.showDetail(parsedId));
      }
      setState(result);
    } catch (e) {
      setError("Can't find information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  return loading ? (
    <>
      <Helmet>
        <title>Loading... | Nomflix</title>
      </Helmet>
      <Loader />
    </>
  ) : (
    <Container>
      <Helmet>
        <title>{result.original_title ? result.original_title : result.original_name} | Nomflix</title>
      </Helmet>
      <BackDrop bgUrl={`https://image.tmdb.org/t/p/original${result.backdrop_path}`} />
      <Content>
        <Cover
          bgUrl={
            result.poster_path
              ? `https://image.tmdb.org/t/p/original${result.poster_path}`
              : require("../assets/noPosterSmall.png").default
          }
        />
        <Data>
          <DataRow>
            <Title>
              <span>{result.original_title ? result.original_title : result.original_name}</span>
              {result.imdb_id && (
                <ImdbLink href={`https://www.imdb.com/title/${result.imdb_id}`} target="_blank" />
              )}
            </Title>
            <ItemContainer>
              <Item>
                {result.release_date
                  ? result.release_date.substring(0, 4)
                  : result.first_air_date.substring(0, 4)}
              </Item>
              <Divider>•</Divider>
              <Item>{result.runtime ? result.runtime : result.episode_run_time[0]} min</Item>
              <Divider>•</Divider>
              <Item>
                {result.genres &&
                  result.genres.map((genre, index) =>
                    index === result.genres.length - 1 ? genre.name : `${genre.name} / `,
                  )}
              </Item>
            </ItemContainer>
            <Overview>{result.overview}</Overview>
          </DataRow>
          <DataRow>
            <InfoTabs>
              <Tab active={pathname.includes("trailers") ? 1 : 0} to={`${contentIdUrl}/trailers`}>
                Trailer
              </Tab>
              <Tab active={pathname.includes("cast") ? 1 : 0} to={`${contentIdUrl}/cast`}>
                Cast & Crew
              </Tab>
              <Tab active={pathname.includes("production") ? 1 : 0} to={`${contentIdUrl}/production`}>
                Production
              </Tab>
              {isMovie && result.belongs_to_collection && (
                <Tab
                  active={pathname.includes("collection") ? 1 : 0}
                  to={`/movie/${id}/collection/${result.belongs_to_collection.id}`}
                >
                  Collections
                </Tab>
              )}
              {!isMovie && result.seasons && (
                <Tab active={pathname.includes("seasons") ? 1 : 0} to={`${contentIdUrl}/seasons`}>
                  Seasons
                </Tab>
              )}
            </InfoTabs>
            <Route path={`${baseUrl}/:id/trailers`} component={Trailers} />
            <Route path={`${baseUrl}/:id/cast`} component={Cast} />
            <Route path={`${baseUrl}/:id/production`} component={Production} />
            <Route path={`${baseUrl}/:id/collection/:colectionId`} component={Collection} />
            <Route path={`${baseUrl}/:id/seasons`} component={Seasons} />
          </DataRow>
        </Data>
      </Content>
    </Container>
  );
};
