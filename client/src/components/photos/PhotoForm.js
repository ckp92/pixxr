import "../../styles/photos/PhotoForm.css";
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import validateTags from "../../utils/validateTags";
import formFields from "./formFields";
import FormField from "../FormField";
import GenericButton from "../GenericButton";

class PhotoForm extends Component {
  // url, title, tags, userId
  onFormSubmit = formValues => {
    const { auth } = this.props;
    const values = { ...formValues, userId: auth.id };

    console.log("onFormSubmit Values: ", formValues);
    console.log("obj to send to backend: ", values);
  };

  renderForm = () => {
    return formFields.map(fields => {
      return <Field key={fields.name} {...fields} component={FormField} />;
    });
  };

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
            <GenericButton text="Next" color="generic" type="submit" />
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

const mapStateToProps = ({ auth }) => {
  return { auth };
};

const connected = connect(mapStateToProps, {})(withRouter(PhotoForm));

export default reduxForm({ form: "photoForm", validate })(connected);
