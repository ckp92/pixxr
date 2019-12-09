import "../../styles/photos/PhotoEdit.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getPhoto, editPhoto } from "../../actions";
import Shell from "../Shell";
import PhotoForm from "./PhotoForm";

class PhotoEdit extends Component {
  componentDidMount = () => {
    const {
      getPhoto,
      match: {
        params: { id }
      }
    } = this.props;

    getPhoto(id);
  };

  renderHeader = () => {
    return (
      <React.Fragment>
        <h1>Edit Photo</h1>
        <p>Amend your photo here!</p>
      </React.Fragment>
    );
  };

  renderContent = () => {
    const { auth, photos } = this.props;

    if (!photos) return;

    // will show error msg if user doesn't own photo (manually types in url)
    if (auth.id !== photos.data[0].user_id) {
      return <p>Oops - You can only edit your own photos!</p>;
    } else {
      return (
        <PhotoForm
          initialValues={this.initialValues()}
          onSubmit={this.onSubmitForm}
        />
      );
    }
  };

  // get the initial formvalues form the state which we called in componentdidmount
  initialValues = () => {
    if (!this.props.photos) return;
    const { image_url, title, tags } = this.props.photos.data[0];

    if (!tags) return;

    return { imgUrl: image_url, imgTitle: title, imgTags: tags.join(", ") };
  };

  onSubmitForm = formValues => {
    const {
      editPhoto,
      history,
      auth,
      photos,
      match: {
        params: { id }
      }
    } = this.props;

    // if no photo data (loading) or if user isn't owner of the photo
    if (!photos || photos.data[0].user_id !== auth.id) return;

    // formValues, photoId, photoOwnerId, history
    editPhoto(formValues, id, photos.data[0].user_id, history);
    console.log(formValues);
  };

  renderFooter = () => {
    return (
      <p>
        When adding tags, separate each one with a comma. Tags must only contain
        letters and numbers.
      </p>
    );
  };

  render() {
    return (
      <div className="photo-edit">
        <Shell
          header={this.renderHeader()}
          content={this.renderContent()}
          footer={this.renderFooter()}
          type="form"
        />
      </div>
    );
  }
}

const mapStateToProps = ({ photos, auth }) => {
  return { photos, auth };
};

export default connect(mapStateToProps, { getPhoto, editPhoto })(PhotoEdit);
