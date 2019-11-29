import "../../styles/landing/LandingForm.css";
import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  checkUniqueUsername,
  login,
  checkAlphanumeric,
  clearAlphanumeric
} from "../../actions";
import LandingFormField from "./LandingFormField";
import GenericButton from "../GenericButton";
import landingOptions from "./landingOptions";

class LoginForm extends Component {
  // will reset states
  componentDidMount = () => {
    this.props.checkUniqueUsername("");
    this.props.clearAlphanumeric();
  };

  // login submit
  onLoginSubmit = formValues => {
    const { uniqueUsername, isAlphanumeric, history, login } = this.props;

    // log the user in if username passes tests
    if (uniqueUsername === false && isAlphanumeric) {
      login(formValues, history);
    }
  };

  renderFields = () => {
    return landingOptions.map(options => {
      const { name } = options;
      return (
        <Field
          key={name}
          onChange={e => this.onUsernameChange(name, e.target.value)}
          validation={this.loginValidation(name)}
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
  loginValidation = name => {
    const { uniqueUsername, isAlphanumeric, auth, loginForm } = this.props;

    // password validation
    if (name === "password") {
      // if there's an error message
      if (auth && auth.message) {
        let passErrorMsg = null;

        // select string to display
        switch (auth.message) {
          case "incorrect":
            passErrorMsg = "Password Incorrect. Please Try Again";
            break;
          // default === "fetchLoginError" "checkPassError"
          default:
            passErrorMsg = "Internal Error. Please Try Again";
            break;
        }

        // return the jsx with the string
        return (
          <span className="red">
            <i className="far fa-times-circle" /> {passErrorMsg}
          </span>
        );
      }
    }

    // username validation
    if (name === "username") {
      // fix weird backspace bug
      // return '' if there's no formvalues, or if there's a password but no username value
      if (loginForm) {
        if (!loginForm.values) {
          return "";
        } else {
          if (!loginForm.values.username) return "";
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

      // normal validation
      switch (uniqueUsername) {
        case true:
          // can't find username in db
          return (
            <span className="red">
              <i className="far fa-times-circle" /> Username Not Found
            </span>
          );
        case false:
          // username found in db
          return (
            <span className="green">
              <i className="far fa-check-circle" /> Username Found
            </span>
          );
        default:
          return "";
      }
    }
  };

  render() {
    return (
      <div className="landing-form-content">
        <form onSubmit={this.props.handleSubmit(this.onLoginSubmit)}>
          <div className="form-fields">{this.renderFields()}</div>
          <GenericButton text="Login" type="submit" color="generic" />
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
  auth,
  form: { loginForm },
  isAlphanumeric
}) => {
  return { uniqueUsername, signupMode, auth, loginForm, isAlphanumeric };
};

const connected = connect(mapStateToProps, {
  checkUniqueUsername,
  login,
  checkAlphanumeric,
  clearAlphanumeric
})(withRouter(LoginForm));

export default reduxForm({ validate, form: "loginForm" })(connected);
