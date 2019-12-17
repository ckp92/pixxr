import "../styles/ContactRequest.css";
import React from "react";
import { Link } from "react-router-dom";
import Shell from "./Shell";

const ContactRequest = ({ contentHeader, contentMain }) => {
  const renderContent = () => {
    return (
      <div className="contact-request-content">
        <p>{contentMain} available upon request</p>

        <Link to="/contact">Click here to go to the Contact page</Link>
      </div>
    );
  };

  return (
    <div className="contact-request">
      <Shell
        header={<h1>{contentHeader}</h1>}
        content={renderContent()}
        type="normal"
      />
    </div>
  );
};

export default ContactRequest;
