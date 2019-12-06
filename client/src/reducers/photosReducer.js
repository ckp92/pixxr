import { GET_PHOTOS, GET_PHOTO, TOGGLE_LIKE } from "../actions/types";

export default (state = null, action) => {
  switch (action.type) {
    case GET_PHOTOS:
    case GET_PHOTO:
      return action.payload;
    case TOGGLE_LIKE:
      return returnToggleLike({ ...state }, action.payload);
    default:
      return state;
  }
};

const returnToggleLike = (state, payload) => {
  // if errors just return normal state;
  if (payload.error || payload.data.length !== 1) return state;

  // get id of photo returned to us
  const { id } = payload.data[0];

  // find index of that photo in the 'old' state
  const i = state.data.findIndex(photo => photo.id === id);

  // replace 'old' photo data with 'new'
  state.data[i] = payload.data[0];

  return state;
};
