import "../styles/App.css";
import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Header from "./header/Header";
import Landing from "./landing/Landing";
import Docs from "./docs/Docs";
import CV from "./cv/CV";
import Contact from "./contact/Contact";
import Photos from "./photos/Photos";

class App extends Component {
  render() {
    return (
      <div className="app">
        <BrowserRouter>
          <div className="container">
            <Header />
            <Route path="/" exact component={Landing} />
            <Route path="/docs" exact component={Docs} />
            <Route path="/cv" exact component={CV} />
            <Route path="/contact" exact component={Contact} />
            <Route path="/photos" exact component={Photos} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
