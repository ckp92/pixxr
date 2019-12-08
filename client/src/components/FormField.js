import "../styles/FormField.css";
import React from "react";

const FormField = ({
  input,
  name,
  id,
  placeholder,
  type,
  meta: { active, error, touched }
}) => {
  const renderClassName = () => {
    if (type === "textarea") return "form-field textarea";
    else return "form-field";
  };

  const renderField = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            id={id}
            name={name}
            placeholder={placeholder}
            cols="30"
            rows="10"
            {...input}
          ></textarea>
        );
      default:
        return (
          <input
            name={name}
            id={id}
            placeholder={placeholder}
            type={type}
            {...input}
          />
        );
    }
  };
  return (
    <div className={renderClassName()}>
      {renderField()}
      <div className="form-error">{touched && error ? error : ""}</div>
    </div>
  );
};

export default FormField;
