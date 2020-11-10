import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { moviesApi, tvApi } from "api";

const Container = styled.div`
  padding: 20px;
  width: 100%;

  display: grid;
  align-items: center;
  grid-template-columns: repeat(3, minmax(70px, 1fr));
  grid-gap: 10px;
`;

const Video = styled.div``;

const VideoLink = styled.a`
  & > img {
    max-width: 100%;
    object-fit: cover;
    transition: transform 0.3s ease-in-out;
    &:hover {
      transform: scale(1.02);
      box-shadow: 0px 0px 5px 1px rgba(51, 114, 143, 0.8);
    }
  }
`;

const Title = styled.div`
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
  const [videos, setState] = useState();

  const loadData = async () => {
    setLoading(true);
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return push("/");
    }

    let videosData = null;

    try {
      if (isMovie) {
        ({ data: videosData } = await moviesApi.videos(parsedId));
      } else {
        ({ data: videosData } = await tvApi.videos(parsedId));
      }

      setState(videosData.results);
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
          {videos &&
            videos.length > 0 &&
            videos.map((video, index) => (
              <Video key={index}>
                {video.site === "YouTube" && (
                  <VideoLink href={`https://www.youtube.com/watch?v=${video.key}`}>
                    <img src={`https://img.youtube.com/vi/${video.key}/sddefault.jpg`} />
                    <Title>{video.name}</Title>
                  </VideoLink>
                )}
              </Video>
            ))}
        </Container>
      )}
    </>
  );
};
