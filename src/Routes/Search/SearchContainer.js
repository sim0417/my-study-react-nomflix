import React from "react";
import SeachPresenter from "./SearchPresenter";
import { moviesApi, tvApi } from "api";

export default class extends React.Component {
  state = {
    movieResults: null,
    tvResults: null,
    searchTerm: "",
    previousTerm: "",
    loading: false,
    error: null,
  };

  handleSubmit = (evnet) => {
    evnet.preventDefault();

    let { searchTerm } = this.state;
    if (searchTerm) {
      searchTerm = searchTerm.trim();
      if (searchTerm !== "") {
        this.searchByTerm();
      }
    }
  };

  updateTerm = (event) => {
    const {
      target: { value },
    } = event;
    this.setState({
      searchTerm: value,
    });
  };

  searchByTerm = async () => {
    let { searchTerm } = this.state;

    this.setState({ loading: true });
    try {
      const {
        data: { results: movieResults },
      } = await moviesApi.search(searchTerm);

      const {
        data: { results: tvResults },
      } = await tvApi.search(searchTerm);

      this.setState({ movieResults, tvResults, previousTerm: searchTerm });
    } catch {
      this.setState({ error: "Con't find results." });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { movieResults, tvResults, searchTerm, previousTerm, error, loading } = this.state;
    return (
      <SeachPresenter
        movieResults={movieResults}
        tvResults={tvResults}
        searchTerm={searchTerm}
        previousTerm={previousTerm}
        error={error}
        loading={loading}
        handleSubmit={this.handleSubmit}
        updateTerm={this.updateTerm}
      />
    );
  }
}
