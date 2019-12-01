import "../../styles/contact/ContactFormReview.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleFormReview, sendEmail } from "../../actions";
import { withRouter } from "react-router-dom";
import formFields from "./formFields";
import GenericButton from "../GenericButton";

class ContactFormReview extends Component {
  renderContent = () => {
    return formFields.map(({ name, label }) => {
      return (
        <div key={name} className="review-field">
          <h4>{label}</h4>
          {this.formatFormValues(name)}
        </div>
      );
    });
  };

  formatFormValues = name => {
    const { formValues } = this.props;
    if (name === "body") {
      return formValues.body.split("\n").map((line, i) => {
        return <p key={i}>{line}</p>;
      });
    } else {
      return <p>{formValues[name]}</p>;
    }
  };

  onGoBack = () => {
    this.props.toggleFormReview(false);
  };

  onReviewSubmit = () => {
    const { sendEmail, auth, formValues, history } = this.props;

    const values = {
      senderName: auth.username,
      userId: auth.id,
      ...formValues
    };

    sendEmail(values, history);
  };

  render() {
    return (
      <div className="form">
        {this.renderContent()}
        <div className="form-buttons">
          <div className="form-buttons-inner">
            <GenericButton
              text="Back"
              color="generic"
              onButtonClick={this.onGoBack}
            />
            <GenericButton
              text="Send"
              color="generic"
              onButtonClick={this.onReviewSubmit}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ form, auth }) => {
  return { formValues: form.contactForm.values, auth };
};

export default connect(mapStateToProps, { toggleFormReview, sendEmail })(
  withRouter(ContactFormReview)
);
