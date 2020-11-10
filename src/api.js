import axios from "axios";

const MOVIE_API_KEY = "5181b57410b2ce3a15385acebfc7d3e0";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  params: {
    api_key: MOVIE_API_KEY,
    language: "en-US",
  },
});

export const collectionApi = {
  collectionDetail: (id) => api.get(`collection/${id}`),
};

export const moviesApi = {
  nowPlaying: () => api.get("movie/now_playing"),
  upComing: () => api.get("movie/upcoming"),
  popular: () => api.get("movie/popular"),
  movieDetail: (id) =>
    api.get(`movie/${id}`, {
      params: {
        append_to_response: "videos",
      },
    }),
  search: (term) =>
    api.get("search/movie", {
      params: {
        query: encodeURIComponent(term),
      },
    }),
  videos: (id) => api.get(`movie/${id}/videos`),
  credits: (id) => api.get(`movie/${id}/credits`),
};

export const tvApi = {
  topRated: () => api.get("tv/top_rated"),
  popular: () => api.get("tv/popular"),
  airingToday: () => api.get("tv/airing_today"),
  showDetail: (id) =>
    api.get(`tv/${id}`, {
      params: {
        append_to_response: "videos",
      },
    }),
  search: (term) =>
    api.get("search/tv", {
      params: {
        query: encodeURIComponent(term),
      },
    }),
  videos: (id) => api.get(`tv/${id}/videos`),
  credits: (id) => api.get(`tv/${id}/credits`),
};
