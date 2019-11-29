import { SET_USERNAME, CLEAR_SET_USERNAME } from "../actions/types";

export default (state = null, action) => {
  switch (action.type) {
    case SET_USERNAME:
    case CLEAR_SET_USERNAME:
      return action.payload;
    default:
      return state;
  }
};
