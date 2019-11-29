import "../../styles/landing/LandingFormField.css";
import React from "react";

const LandingFormField = ({
  input,
  ids: { fieldId, validationId, inputId, errorId },
  type,
  validation,
  placeholder,
  meta: { error, touched }
}) => {
  return (
    <div id={fieldId} className="landing-form-field">
      <div id={validationId} className="username-validation">
        {validation}
      </div>
      <input id={inputId} {...input} type={type} placeholder={placeholder} />
      <div id={errorId} className="landing-form-error">
        {touched && error ? error : ""}
      </div>
    </div>
  );
};

export default LandingFormField;
