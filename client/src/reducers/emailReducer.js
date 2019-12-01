import { SEND_EMAIL, CLOSE_EMAIL_MODAL } from "../actions/types";

export default (state = null, action) => {
  switch (action.type) {
    case SEND_EMAIL:
      return action.payload;
    case CLOSE_EMAIL_MODAL:
      return null;
    default:
      return state;
  }
};
