import "../../styles/photos/PhotoShow.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getPhoto } from "../../actions";
import Shell from "../Shell";
import PhotoCardFull from "./PhotoCardFull";
import GenericButton from "../GenericButton";

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

    // error msg
    if (error || data.length !== 1 || !data[0].id)
      return <p>Oops! {message}</p>;

    console.log(data);

    // success
    return <PhotoCardFull {...data[0]} type="single" />;
  };

  renderFooter = () => {
    const { history } = this.props;
    return (
      <div className="back-to-photos">
        <GenericButton
          color="generic"
          text="Back to Photos"
          onButtonClick={() => history.push("/")}
        />
      </div>
    );
  };

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
