import "../../styles/photos/PhotoList.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getPhotos, setPage } from "../../actions/index";
import Shell from "../Shell";
import PhotoCard from "./PhotoCard";
import Pagination from "../accessories/Pagination";

class PhotoList extends Component {
  componentDidMount = () => {
    const { getPhotos, setPage } = this.props;

    getPhotos(0);
    setPage(0);
  };

  renderHeader = () => {
    return (
      <React.Fragment>
        <h1>All Photos!</h1>
        <p>Here is a list of all the photos!</p>
      </React.Fragment>
    );
  };

  renderContent = () => {
    // loading
    if (!this.props.photos) return <p>Loading...</p>;

    const {
      photos: { error, message, data }
    } = this.props;

    // error msg
    if (error || !data.length) return <p>Oops! {message}</p>;

    // success
    return data.map(photo => (
      <PhotoCard key={photo.id} {...photo} type="multi" />
    ));
  };

  renderFooter = () => {
    return (
      <React.Fragment>
        <Pagination />
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
          type="normal"
        />
      </div>
    );
  }
}

const mapStateToProps = ({ photos, currentPage }) => {
  return { photos, currentPage };
};

export default connect(mapStateToProps, { getPhotos, setPage })(PhotoList);
