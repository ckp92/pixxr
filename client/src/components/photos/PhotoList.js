import "../../styles/photos/PhotoList.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getPhotos } from "../../actions/index";
import Shell from "../Shell";
import ListHeader from "../accessories/ListHeader";
import PhotoCard from "./PhotoCard";
import Pagination from "../accessories/Pagination";

class PhotoList extends Component {
  componentDidMount = () => {
    const {
      getPhotos,
      currentPage,
      searchType: { searchType, value }
    } = this.props;

    // set state so it's correct for initial mount
    getPhotos(currentPage, searchType, value);
  };

  renderContent = () => {
    // loading
    if (!this.props.photos) return <p>Loading...</p>;

    const {
      photos: { error, message, data, total }
    } = this.props;

    // no photos
    if (!total) return <p>Oops! There's no photos here!</p>;

    // error msg
    if (error || !data.length) return <p>Oops! {message}</p>;

    // success
    return data.map((photo, i) => (
      <PhotoCard key={i} {...photo} type="multi" />
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
          header={<ListHeader searchType={this.props.searchType} />}
          content={this.renderContent()}
          footer={this.renderFooter()}
          type="normal"
        />
      </div>
    );
  }
}

const mapStateToProps = ({ photos, currentPage, searchType }) => {
  return { photos, currentPage, searchType };
};

export default connect(mapStateToProps, { getPhotos })(PhotoList);
