import "../../styles/accessories/CommentsForm.css";
import React, { Component } from "react";
import { Field, reduxForm, reset } from "redux-form";
import { connect } from "react-redux";
import { addComment } from "../../actions/index";
import FormField from "../FormField";
import GenericButton from "../GenericButton";

class CommentsForm extends Component {
  onFormSubmit = (formValues, dispatch) => {
    const { photoId, addComment } = this.props;

    addComment({ ...formValues, photoId });

    // clear textarea on submit
    dispatch(reset("commentsForm"));
  };

  render() {
    return (
      <form
        onSubmit={this.props.handleSubmit(this.onFormSubmit)}
        className="comments-form"
      >
        <Field
          id="comments-textarea"
          type="textarea"
          name="commentText"
          placeholder="Add a comment"
          component={FormField}
        />
        <GenericButton type="submit" text="Add Comment" color="generic" />
      </form>
    );
  }
}

const validate = formValues => {
  const errors = {};

  if (!formValues.commentText) errors.commentText = "You must include a value";

  return errors;
};

const connected = connect(null, { addComment })(CommentsForm);

export default reduxForm({ form: "commentsForm", validate })(connected);
