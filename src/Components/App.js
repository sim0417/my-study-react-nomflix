import React, { Component } from "react";
import Router from "Components/Router";
import Header from "Components/Header";

export default class App extends Component {
  render() {
    return (
      <>
        <Header />
        <Router />
      </>
    );
  }
}
