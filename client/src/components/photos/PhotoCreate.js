import "../../styles/photos/PhotoCreate.css";
import React, { Component } from "react";
import Shell from "../Shell";
import FormShell from "../FormShell";
import PhotoForm from "./PhotoForm";

class PhotoCreate extends Component {
  render() {
    return (
      <Shell>
        <div className="photo-create">
          <FormShell>
            <div className="form-header">
              <h1>Add Photo</h1>
              <p>Fill this out to add a new photo!</p>
            </div>
            <div className="form-content">
              <PhotoForm />
            </div>
            <div className="form-footer">
              When adding tags, separate each one with a comma. Tags must only
              contain letters and numbers.
            </div>
          </FormShell>
        </div>
      </Shell>
    );
  }
}

export default PhotoCreate;
