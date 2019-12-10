import "../../styles/contact/Contact.css";
import React, { Component } from "react";
import Shell from "../Shell";
import { connect } from "react-redux";
import { toggleFormReview } from "../../actions";
import { reduxForm } from "redux-form";
import ContactForm from "./ContactForm";
import ContactFormReview from "./ContactFormReview";

class Contact extends Component {
  componentWillUnmount = () => this.props.toggleFormReview(false);
  renderHeader = () => {
    const { isFormReviewOn } = this.props;

    if (isFormReviewOn) {
      return (
        <React.Fragment>
          <h1>Review and Send</h1>
          <p>Does everything look ok?</p>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <h1>Contact</h1>
          <p>Got some feedback? I'd love to hear it!</p>
        </React.Fragment>
      );
    }
  };

  renderContent = () => {
    const { isFormReviewOn } = this.props;

    if (isFormReviewOn) {
      return <ContactFormReview />;
    } else {
      return <ContactForm />;
    }
  };

  renderFooter = () => {
    return (
      <p>
        Alternatively you can send an email to{" "}
        <a
          href="mailto:cpatel818@gmail.com?Subject=RE:%20PIXXR"
          target="_blank"
          rel="noopener noreferrer"
        >
          cpatel818@gmail.com
        </a>
      </p>
    );
  };

  render() {
    return (
      <div className="contact">
        <Shell
          header={this.renderHeader()}
          content={this.renderContent()}
          footer={this.renderFooter()}
          type="form"
        />
      </div>
    );
  }
}

const mapStateToProps = ({ isFormReviewOn }) => {
  return { isFormReviewOn };
};

const connected = connect(mapStateToProps, { toggleFormReview })(Contact);

export default reduxForm({ form: "contactForm" })(connected);
