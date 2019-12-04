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

    const {
      photos: { error, message, data }
    } = this.props;

    console.log(this.props.photos);

    // error msg
    if (error || !data.id) return <p>Oops! {message}</p>;

    // success
    return <PhotoCardFull {...data} type="single" />;
  };

  renderFooter = () => {};

  render() {
    console.log(this.props);
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
