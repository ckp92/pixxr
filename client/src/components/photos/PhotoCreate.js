import "../../styles/photos/PhotoCreate.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { addPhoto } from "../../actions";
import Shell from "../Shell";
import PhotoForm from "./PhotoForm";

class PhotoCreate extends Component {
  renderHeader = () => {
    return (
      <React.Fragment>
        <h1>Add Photo</h1>
        <p>Fill this out to add a new photo!</p>
      </React.Fragment>
    );
  };

  onSubmitForm = formValues => {
    const { addPhoto, history } = this.props;
    addPhoto(formValues, history);
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
      <div className="photo-create">
        <Shell
          header={this.renderHeader()}
          content={<PhotoForm onSubmit={this.onSubmitForm} />}
          footer={this.renderFooter()}
          type="form"
        />
      </div>
    );
  }
}

export default connect(null, { addPhoto })(PhotoCreate);
