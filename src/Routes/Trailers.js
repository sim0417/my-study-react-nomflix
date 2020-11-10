import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { moviesApi, tvApi } from "api";

const Container = styled.div`
  padding: 20px;
  width: 100%;

  display: grid;
  align-items: flex-start;
  grid-template-columns: repeat(3, minmax(70px, 1fr));
  grid-gap: 10px;
`;

const Video = styled.div``;

const VideoLink = styled.a`
  & > img {
    max-width: 100%;
    object-fit: cover;
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
    &:hover {
      transform: scale(1.02);
      box-shadow: 0px 0px 5px 1px rgba(0, 142, 207, 0.8);
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

      if (videosData.results.length > 6) {
        videosData.results = videosData.results.slice(0, 6);
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
            videos.map(
              (video, index) =>
                video.site === "YouTube" && (
                  <Video key={index}>
                    <VideoLink href={`https://www.youtube.com/watch?v=${video.key}`} target="_blink">
                      <img src={`https://img.youtube.com/vi/${video.key}/sddefault.jpg`} />
                      <Title>{video.name}</Title>
                    </VideoLink>
                  </Video>
                ),
            )}
        </Container>
      )}
    </>
  );
};
