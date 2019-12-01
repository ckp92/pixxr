import { TOGGLE_FORM_REVIEW } from "../actions/types";

export default (state = false, action) => {
  switch (action.type) {
    case TOGGLE_FORM_REVIEW:
      return action.payload;
    default:
      return state;
  }
};
