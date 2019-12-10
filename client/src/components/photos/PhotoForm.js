import "../../styles/photos/PhotoForm.css";
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { addPhoto, getPhotos } from "../../actions";
import validateTags from "../../utils/validateTags";
import formFields from "./formFields";
import FormField from "../FormField";
import GenericButton from "../GenericButton";

class PhotoForm extends Component {
  // url, title, tags
  onFormSubmit = formValues => {
    this.props.onSubmit(formValues);
  };

  renderForm = () => {
    return formFields.map(fields => {
      return <Field key={fields.name} {...fields} component={FormField} />;
    });
  };

  // change to link?
  onClickBack = () => {
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
    return (
      <form
        className="form"
        onSubmit={this.props.handleSubmit(this.onFormSubmit)}
      >
        {this.renderForm()}
        <div className="form-buttons">
          <div className="form-buttons-inner">
            <GenericButton
              text="Cancel"
              color="generic"
              onButtonClick={this.onClickBack}
            />
            <GenericButton text="Save" color="generic" type="submit" />
          </div>
        </div>
      </form>
    );
  }
}

const validate = formValues => {
  const errors = {};

  // length validation
  if (formValues.imgUrl && formValues.imgUrl.length > 250)
    errors.imgUrl = "Too long. Max length: 250 chars";
  if (formValues.imgTitle && formValues.imgTitle.length > 250)
    errors.imgTitle = "Too long. Max length: 250 chars";

  // valid imgurl regex
  const re = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

  // imgUrl validation
  if (re.test(formValues.imgUrl) === false) errors.imgUrl = "Invalid URL";

  // validate tags
  errors.imgTags = validateTags(formValues.imgTags || "");

  // empty field validation
  formFields.forEach(field => {
    if (!formValues[field.name]) errors[field.name] = "Required";
  });

  return errors;
};

const mapStateToProps = ({ searchType, currentPage }) => {
  return { searchType, currentPage };
};

const connected = connect(mapStateToProps, { addPhoto, getPhotos })(
  withRouter(PhotoForm)
);

export default reduxForm({ form: "photoForm", validate })(connected);
