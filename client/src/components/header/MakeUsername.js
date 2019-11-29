import "../../styles/header/MakeUsername.css";
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  checkUniqueUsername,
  setUsername,
  clearSetUsername,
  checkAlphanumeric,
  clearAlphanumeric
} from "../../actions";

import Modal from "../Modal";
import GenericButton from "../GenericButton";
import LandingFormField from "../landing/LandingFormField";

class MakeUsername extends Component {
  // will reset states
  componentDidMount = () => {
    this.props.checkUniqueUsername("");
    this.props.clearAlphanumeric();
  };

  componentWillUnmount = () => {
    this.props.clearAlphanumeric();
  };

  renderModal = () => {
    const header = <h3>First Pick A Username</h3>;
    const actions = (
      <GenericButton
        id="make-username-btn"
        text="Submit"
        type="submit"
        color="generic"
        onButtonClick={e => this.onFormSubmit(e.target.value)}
      />
    );

    return (
      <Modal header={header} content={this.renderForm()} actions={actions} />
    );
  };

  // not using formValues handed down from 'handleSubmit' because the 'submit' button isn't part of the form, so when it's clicked, we won't get the formValues.
  // instead will get them from the state
  onFormSubmit = () => {
    const {
      makeUsername,
      uniqueUsername,
      isAlphanumeric,
      auth: { id },
      setUsername,
      history
    } = this.props;

    if (
      isAlphanumeric &&
      makeUsername &&
      makeUsername.values &&
      uniqueUsername === true
    ) {
      console.log("form submitted", makeUsername.values);
      setUsername({ ...makeUsername.values, id }, history);
    }
  };

  renderForm = () => {
    const { handleSubmit } = this.props;
    const ids = {
      fieldId: "make-username-field",
      validationId: "make-username-validation",
      inputId: "make-username-input",
      errorId: "make-username-error"
    };

    return (
      <form id="make-username-form" onSubmit={handleSubmit(this.onFormSubmit)}>
        <Field
          ids={ids}
          type="text"
          name="username"
          placeholder="Username"
          onChange={e => this.onInputChange(e.target.value)}
          validation={this.usernameValidation()}
          component={LandingFormField}
        />
      </form>
    );
  };

  // live username validation
  onInputChange = inputValue => {
    const {
      checkUniqueUsername,
      wasUsernameSuccessfullySet,
      clearSetUsername,
      checkAlphanumeric
    } = this.props;

    // check to see is username is unique
    checkUniqueUsername(inputValue);

    // check to see input is alphanumeric
    checkAlphanumeric(inputValue);

    // if wasUsernameSuccessfullySet isn't null, set it to null
    if (wasUsernameSuccessfullySet != null) {
      clearSetUsername();
    }
  };

  // above-input username validation messages
  usernameValidation = () => {
    const {
      uniqueUsername,
      makeUsername,
      wasUsernameSuccessfullySet,
      isAlphanumeric
    } = this.props;

    // weird backspace bug fix
    if (makeUsername && !makeUsername.values) {
      return "";
    }

    // alphanumeric validation
    if (!isAlphanumeric)
      return (
        <span className="red">
          <i className="far fa-times-circle" /> Must Only Use Letters and
          Numbers
        </span>
      );

    // show error msg in the (unlikely) chanse there was an error with form submission
    if (makeUsername.syncErrors)
      if (wasUsernameSuccessfullySet === false)
        return (
          <span className="red">
            <i className="fas fa-exclamation-triangle" /> Oops - there was an
            error. Please try again.
          </span>
        );

    // normal validation
    switch (uniqueUsername) {
      case true:
        // username not already taken
        return (
          <span className="green">
            <i className="far fa-check-circle" /> Username OK
          </span>
        );
      case false:
        // username already taken
        return (
          <span className="red">
            <i className="far fa-times-circle" /> Username Taken
          </span>
        );
      default:
        return "";
    }
  };

  render() {
    return <div className="make-username">{this.renderModal()}</div>;
  }
}

const validate = formValues => {
  const error = {};

  if (!formValues.username) error.username = "You must include a value";

  return error;
};

const mapStateToProps = ({
  form: { makeUsername },
  uniqueUsername,
  wasUsernameSuccessfullySet,
  auth,
  isAlphanumeric
}) => {
  return {
    makeUsername,
    uniqueUsername,
    wasUsernameSuccessfullySet,
    auth,
    isAlphanumeric
  };
};

const connected = connect(mapStateToProps, {
  checkUniqueUsername,
  setUsername,
  clearSetUsername,
  checkAlphanumeric,
  clearAlphanumeric
})(withRouter(MakeUsername));

export default reduxForm({ form: "makeUsername", validate })(connected);
