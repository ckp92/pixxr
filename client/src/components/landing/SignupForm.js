import "../../styles/landing/LandingForm.css";
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  checkUniqueUsername,
  signup,
  checkAlphanumeric,
  clearAlphanumeric
} from "../../actions";
import LandingFormField from "./LandingFormField";
import GenericButton from "../GenericButton";
import landingOptions from "./landingOptions";

class SignupForm extends Component {
  // will reset states
  componentDidMount = () => {
    this.props.checkUniqueUsername("");
    this.props.clearAlphanumeric();
  };

  // submit signup
  onSignupSubmit = formValues => {
    const { uniqueUsername, isAlphanumeric, history, signup } = this.props;

    // sign the user up if username passes tests
    if (uniqueUsername === true && isAlphanumeric) {
      signup(formValues, history);
    }
  };

  renderFields = () => {
    return landingOptions.map(options => {
      const { name } = options;
      return (
        <Field
          key={name}
          onChange={e => this.onUsernameChange(name, e.target.value)}
          validation={this.signupValidation(name)}
          {...options}
          component={LandingFormField}
        />
      );
    });
  };

  // live username validation
  onUsernameChange = (name, username) => {
    const { checkUniqueUsername, checkAlphanumeric } = this.props;
    if (name === "username") {
      checkUniqueUsername(username);
      checkAlphanumeric(username);
    }
  };

  // above-input validation messages
  signupValidation = name => {
    const { uniqueUsername, signupForm, isAlphanumeric } = this.props;

    if (name === "password") return;

    // fix weird backspace bug
    // return '' if there's no formvalues, or if there's a password but no username value
    if (signupForm) {
      if (!signupForm.values) {
        return "";
      } else {
        if (!signupForm.values.username) return "";
      }
    }

    // alphanumeric validation
    if (!isAlphanumeric)
      return (
        <span className="red">
          <i className="far fa-times-circle" /> Must Only Use Letters and
          Numbers
        </span>
      );

    // unique username validation
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
    return (
      <div className="landing-form-content">
        <form onSubmit={this.props.handleSubmit(this.onSignupSubmit)}>
          <div className="form-fields">{this.renderFields()}</div>
          <GenericButton text="Sign Up" type="submit" color="generic" />
        </form>
      </div>
    );
  }
}

const validate = formValues => {
  const errors = {};

  landingOptions.forEach(({ name }) => {
    if (!formValues[name]) errors[name] = "You must include a value";
  });

  return errors;
};

const mapStateToProps = ({
  uniqueUsername,
  signupMode,
  form: { signupForm },
  isAlphanumeric
}) => {
  return { uniqueUsername, signupMode, signupForm, isAlphanumeric };
};

const connected = connect(mapStateToProps, {
  checkUniqueUsername,
  signup,
  checkAlphanumeric,
  clearAlphanumeric
})(withRouter(SignupForm));

export default reduxForm({ validate, form: "signupForm" })(connected);
