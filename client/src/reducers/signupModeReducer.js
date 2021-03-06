import { SIGNUP_MODE } from "../actions/types";

export default (state = "login", action) => {
  switch (action.type) {
    case SIGNUP_MODE:
      return action.payload;
    default:
      return state;
  }
};
