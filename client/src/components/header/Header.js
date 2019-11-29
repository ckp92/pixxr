import "../../styles/header/Header.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import MakeUsername from "./MakeUsername";

class Header extends Component {
  renderModal = () => {
    const { auth, wasUsernameSuccessfullySet } = this.props;

    // only display if user is logged in, has no username (and wasUsernameSuccessfullySet is false - this will make modal disappear on successful submission with no errors)
    if (auth && auth.id && !auth.username && !wasUsernameSuccessfullySet) {
      console.log(auth.username);
      return <MakeUsername />;
    }
  };

  render() {
    return (
      <div className="header-container">
        {this.renderModal()}
        <div className="header">Header</div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth, wasUsernameSuccessfullySet }) => {
  return { auth, wasUsernameSuccessfullySet };
};

const connected = connect(mapStateToProps, {})(Header);

export default reduxForm({ form: "placeholder" })(connected);
