import { GET_PHOTOS, GET_PHOTO } from "../actions/types";

export default (state = null, action) => {
  switch (action.type) {
    case GET_PHOTOS:
    case GET_PHOTO:
      return action.payload;
    default:
      return state;
  }
};
