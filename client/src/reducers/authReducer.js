import { LOGIN, SIGNUP, GET_USER } from "../actions/types";

export default (state = null, action) => {
  switch (action.type) {
    case SIGNUP:
    case GET_USER:
    case LOGIN:
      return action.payload;
    default:
      return state;
  }
};
