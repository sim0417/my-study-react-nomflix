import React, { Component } from "react";
import Router from "Components/Router";
import Globalstyles from "Components/GlobalStyles";

export default class App extends Component {
  render() {
    return (
      <>
        <Router />
        <Globalstyles />
      </>
    );
  }
}
