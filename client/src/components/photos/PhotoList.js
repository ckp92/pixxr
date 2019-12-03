import "../../styles/photos/PhotoList.css";
import React, { Component } from "react";
import Shell from "../Shell";

class PhotoList extends Component {
  renderHeader = () => {
    return (
      <React.Fragment>
        <h1>All Photos!</h1>
        <p>Here is a list of all the photos!</p>
      </React.Fragment>
    );
  };

  renderContent = () => {};

  renderFooter = () => {
    return (
      <React.Fragment>
        <p>Pagination will go here!</p>
      </React.Fragment>
    );
  };

  render() {
    return (
      <div className="photo-list">
        <Shell
          header={this.renderHeader()}
          content={this.renderContent()}
          footer={this.renderFooter()}
        />
      </div>
    );
  }
}

export default PhotoList;
