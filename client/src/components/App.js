import "../styles/App.css";
import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { getUser, getPhotos, setPage } from "../actions";

import Header from "./header/Header";
import Landing from "./landing/Landing";
import Docs from "./docs/Docs";
import CV from "./cv/CV";
import Contact from "./contact/Contact";

import PhotoCreate from "./photos/PhotoCreate";
import PhotoDelete from "./photos/PhotoDelete";
import PhotoEdit from "./photos/PhotoEdit";
import PhotoList from "./photos/PhotoList";
import PhotoShow from "./photos/PhotoShow";
import PhotoSearchUser from "./photos/PhotoSearchUser";
import PhotoSearchTag from "./photos/PhotoSearchTag";

class App extends Component {
  componentDidMount = () => {
    const {
      getUser,
      getPhotos,
      setPage,
      searchType: { searchType, value }
    } = this.props;

    // set state so it's correct for initial mount
    getUser();
    getPhotos(0, searchType, value);
    setPage(0);
  };

  // don't render header if landing is on
  renderHeader = () => {
    if (!this.props.landingOn) return <Header />;
  };

  // render routes depending on login
  renderLoggedInRoutes = () => {
    const { auth } = this.props;

    if (auth && auth.id) {
      // force user to make username
      if (!auth.username) return;

      return (
        // these components are only visible if logged in
        <div>
          <Switch>
            {/* RESTFUL ROUTES */}
            <Route path="/" exact component={PhotoList} />
            {/* might not need /photos after */}
            <Route path="/photos" exact component={PhotoList} />
            <Route path="/photos/new" exact component={PhotoCreate} />
            <Route path="/photos/edit/:id" exact component={PhotoEdit} />
            <Route path="/photos/delete/:id" exact component={PhotoDelete} />
            <Route path="/photos/:id" exact component={PhotoShow} />
            <Route path="/user/:id/photos" exact component={PhotoSearchUser} />
            <Route
              path="/tag/:tagname/photos"
              exact
              component={PhotoSearchTag}
            />

            {/* OTHER ROUTES */}
            <Route path="/docs" exact component={Docs} />
            <Route path="/cv" exact component={CV} />
            <Route path="/contact" exact component={Contact} />
          </Switch>
        </div>
      );
    }

    // if not logged in, all routes will load 'Landing' component (because of removal of 'exact')
    else return <Route path="/" component={Landing} />;
  };

  render() {
    return (
      <div className="app">
        <BrowserRouter>
          <div className="container">
            {this.renderHeader()}
            {this.renderLoggedInRoutes()}
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

const mapStateToProps = ({ landingOn, auth, searchType }) => {
  return { landingOn, auth, searchType };
};

export default connect(mapStateToProps, { getUser, getPhotos, setPage })(App);
