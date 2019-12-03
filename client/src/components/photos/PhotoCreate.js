import "../../styles/photos/PhotoCreate.css";
import React, { Component } from "react";
import Shell from "../Shell";
import PhotoForm from "./PhotoForm";

class PhotoCreate extends Component {
  render() {
    return (
      <div className="photo-create">
        <Shell>
          <div className="shell-header">
            <h1>Add Photo</h1>
            <p>Fill this out to add a new photo!</p>
          </div>
          <div className="shell-content">
            <PhotoForm />
          </div>
          <div className="shell-footer">
            When adding tags, separate each one with a comma. Tags must only
            contain letters and numbers.
          </div>
        </Shell>
      </div>
    );
  }
}

export default PhotoCreate;
