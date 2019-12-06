import "../../styles/photos/PhotoShow.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getPhoto } from "../../actions";
import Shell from "../Shell";
import PhotoCardFull from "./PhotoCardFull";

class PhotoShow extends Component {
  componentDidMount = () => {
    const {
      getPhoto,
      match: {
        params: { id }
      }
    } = this.props;

    getPhoto(id);
  };

  renderHeader = () => {};

  renderContent = () => {
    // loading
    if (!this.props.photos) return <p>Loading...</p>;

    // only destructure after we know it exists
    const {
      photos: { error, message, data }
    } = this.props;

    if (data.length !== 1) return <p>Loading...</p>;

    // error msg
    if (error || !data[0].id) return <p>Oops! {message}</p>;

    // success
    return <PhotoCardFull {...data[0]} type="single" />;
  };

  renderFooter = () => {};

  render() {
    return (
      <div className="photo-show">
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

const mapStateToProps = ({ photos }) => {
  return { photos };
};

export default connect(mapStateToProps, { getPhoto })(PhotoShow);
