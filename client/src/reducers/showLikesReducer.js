import { TOGGLE_SHOW_LIKES } from "../actions/types";

export default (state = false, action) => {
  switch (action.type) {
    case TOGGLE_SHOW_LIKES:
      return action.payload;
    default:
      return state;
  }
};
