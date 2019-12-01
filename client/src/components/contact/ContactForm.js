import "../../styles/contact/ContactForm.css";
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { toggleFormReview } from "../../actions";
import formFields from "./formFields";
import FormField from "../FormField";
import GenericButton from "../GenericButton";

class ContactForm extends Component {
  renderForm = () => {
    return formFields.map(fields => {
      return <Field key={fields.name} {...fields} component={FormField} />;
    });
  };

  onFormSubmit = formValues => {
    this.props.toggleFormReview(true);
  };

  render() {
    return (
      <form
        className="form"
        onSubmit={this.props.handleSubmit(this.onFormSubmit)}
      >
        {this.renderForm()}
        <div className="form-buttons">
          <GenericButton text="Next" color="generic" type="submit" />
        </div>
      </form>
    );
  }
}

const validate = formValues => {
  const errors = {};

  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // email validation
  if (re.test(formValues.senderEmail) === false)
    errors.senderEmail = "Invalid Email";

  // empty fields
  formFields.forEach(field => {
    console.log("field.name = ", field.name);
    if (!formValues[field.name]) errors[field.name] = "Required";
  });

  return errors;
};

const connected = connect(null, { toggleFormReview })(ContactForm);
export default reduxForm({
  form: "contactForm",
  validate,
  destroyOnUnmount: false
})(connected);
