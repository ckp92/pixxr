import "../../styles/landing/Landing.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  toggleLanding,
  toggleSignupMode,
  clearAlphanumeric
} from "../../actions/index";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
// make action creators and reducers to toggle forms

class Landing extends Component {
  componentDidMount() {
    // will hide header on mount
    this.props.toggleLanding(true);
  }

  componentWillUnmount() {
    // will show header on unmount
    this.props.toggleLanding(false);
    this.props.clearAlphanumeric();
  }

  // render form selection buttons
  renderButtons = () => {
    const { signupMode, toggleSignupMode } = this.props;

    let signupClass = "";
    let loginClass = "";

    // bold and underline currently selected mode
    if (signupMode === "signup") signupClass = "selected";
    if (signupMode === "login") loginClass = "selected";

    return (
      <div className="landing-nav">
        <button id={signupClass} onClick={() => toggleSignupMode("signup")}>
          Sign Up
        </button>
        <button id={loginClass} onClick={() => toggleSignupMode("login")}>
          Login
        </button>
      </div>
    );
  };

  // Render login or signup forms depending on state/selection
  renderLandingForm = () => {
    const { signupMode } = this.props;

    if (signupMode === "signup") {
      return <SignupForm />;
    } else {
      return <LoginForm />;
    }
  };

  render() {
    return (
      <div className="landing-container">
        <div className="landing">
          <h2>PIXXR</h2>
          {this.renderButtons()}
          <div className="landing-form">{this.renderLandingForm()}</div>
          <div className="external-login-options">
            <span className="alternateLogin">Or login with:</span>
            <a className="google" href="/auth/google">
              Google
            </a>
            <a className="facebook" href="/auth/facebook">
              Facebook
            </a>
            <a className="twitter" href="/auth/twitter">
              Twitter
            </a>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ signupMode }) => {
  return { signupMode };
};

export default connect(mapStateToProps, {
  toggleLanding,
  toggleSignupMode,
  clearAlphanumeric
})(Landing);
