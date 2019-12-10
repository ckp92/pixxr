import "../../styles/photos/PhotoDelete.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getPhoto, getPhotos, deletePhoto } from "../../actions";
import Modal from "../Modal";
import GenericButton from "../GenericButton";

class PhotoDelete extends Component {
  componentDidMount = () => {
    const {
      getPhoto,
      match: {
        params: { id }
      }
    } = this.props;

    getPhoto(id);
  };

  renderContent = () => {
    if (!this.props.photos) return;

    const {
      auth: { id },
      photos: { data }
    } = this.props;

    // get the id of the owner of that photo
    const { user_id } = data[0];

    // check if user owns photo
    const isOwner = id === user_id;

    // render depending on ownership
    const content = this.renderModalContent(isOwner);
    const actions = this.renderActions(isOwner);

    return (
      <Modal
        id="delete-modal"
        header={<h3>Delete Photo</h3>}
        content={content}
        actions={actions}
        onDismiss={this.onDismiss}
      />
    );
  };

  renderModalContent = isOwner => {
    if (!this.props.photos) return;
    const { title } = this.props.photos.data[0];

    if (isOwner) {
      return <p>Are you sure you want to delete this photo?</p>;
    } else {
      return <p>Oops - You can only delete photos your own photos!</p>;
    }
  };

  renderActions = isOwner => {
    // only show delete btn if they own the photo
    const deleteButton = isOwner ? (
      <GenericButton
        onButtonClick={this.onDeleteClick}
        text="Delete"
        color="red"
      />
    ) : (
      ""
    );

    return (
      <div className="actions-inner">
        <GenericButton
          onButtonClick={this.onDismiss}
          text="Back"
          color="generic"
        />
        {deleteButton}
      </div>
    );
  };

  onDeleteClick = () => {
    const {
      deletePhoto,
      currentPage,
      searchType: { searchType, value },
      match: {
        params: { id }
      },
      photos: { data },
      history
    } = this.props;

    const { user_id } = data[0];

    deletePhoto(id, user_id, currentPage, searchType, value, history);
  };

  onDismiss = () => {
    const {
      history,
      getPhotos,
      currentPage,
      searchType: { searchType, value }
    } = this.props;

    // update state with correct photos
    getPhotos(currentPage, searchType, value);

    // redirect to correct place
    if (!searchType) {
      history.push("/photos");
    } else {
      history.push(`/${searchType}/${value}/photos`);
    }
  };

  render() {
    return <div className="photo-delete">{this.renderContent()}</div>;
  }
}

const mapStateToProps = ({ photos, auth, searchType, currentPage }) => {
  return { photos, auth, searchType, currentPage };
};

export default connect(mapStateToProps, { getPhoto, getPhotos, deletePhoto })(
  PhotoDelete
);
