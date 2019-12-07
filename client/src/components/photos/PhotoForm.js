import "../../styles/photos/PhotoForm.css";
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { addPhoto } from "../../actions";
import validateTags from "../../utils/validateTags";
import formFields from "./formFields";
import FormField from "../FormField";
import GenericButton from "../GenericButton";

class PhotoForm extends Component {
  // url, title, tags
  onFormSubmit = formValues => {
    const { addPhoto, history } = this.props;

    console.log("onFormSubmit Values: ", formValues);

    addPhoto(formValues, history);
  };

  renderForm = () => {
    return formFields.map(fields => {
      return <Field key={fields.name} {...fields} component={FormField} />;
    });
  };

  // change to link?
  onClickBack = formValues => {
    const { history } = this.props;
    console.log("onClickBack values", formValues);
    history.push("/photos");
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

const connected = connect(null, { addPhoto })(withRouter(PhotoForm));

export default reduxForm({ form: "photoForm", validate })(connected);
