import {
  TOGGLE_LANDING,
  UNIQUE_USERNAME,
  SIGNUP_MODE,
  LOGIN,
  SIGNUP,
  GET_USER,
  SET_USERNAME,
  CLEAR_SET_USERNAME,
  CHECK_ALPHANUMERIC,
  BRAND_DROPDOWN_CLICK,
  MENU_DROPDOWN_CLICK,
  TOGGLE_FORM_REVIEW,
  SEND_EMAIL,
  CLOSE_EMAIL_MODAL,
  GET_PHOTOS,
  GET_PHOTO,
  TOGGLE_LIKE,
  ADD_PHOTO,
  SET_PAGE,
  ADD_COMMENT,
  TOGGLE_SHOW_LIKES,
  SET_SEARCH_TYPE,
  EDIT_PHOTO,
  DELETE_PHOTO
} from "./types";

import alphanumericTest from "../utils/alphanumericTest";

// will toggle landing mode ----------------------------------------------------------------------------------
export const toggleLanding = value => {
  return { type: TOGGLE_LANDING, payload: value };
};

// will check to see if username is unique -------------------------------------------------------------------
export const checkUniqueUsername = username => async dispatch => {
  let payload = null;

  // will only run if username is truthy
  // this means a payload of 'null' will be returned if user types a username and then deletes it all. Good for clean-up because it will make username validator msg disappear in this situation, instead of hanging there
  if (username) {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    };

    try {
      const res = await fetch("/api/find_username", options);

      // will be returned an array, either empty or not
      const data = await res.json();

      if (data.length) payload = false; // username is not unique
      if (!data.length) payload = true; // username is unique
    } catch (error) {
      console.error(error);
    }
  }

  dispatch({ type: UNIQUE_USERNAME, payload });
};

// will be either 'login' or 'signup' depending on what user selects -----------------------------------------
export const toggleSignupMode = value => {
  return { type: SIGNUP_MODE, payload: value };
};

// login -----------------------------------------------------------------------------------------------------
export const login = (formValues, history) => async dispatch => {
  let data = null;

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...formValues })
  };

  try {
    const res = await fetch("/auth/login", options);
    data = await res.json();

    console.log("data returned from login: ", data);
  } catch (error) {
    console.error(error);
    data = { message: "fetchLoginError" };
  }

  dispatch({ type: LOGIN, payload: data });

  // redirect user if login successful
  if (data.id) history.push("/photos");
};

// signup ----------------------------------------------------------------------------------------------------
export const signup = (formValues, history) => async dispatch => {
  let data = null;

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...formValues })
  };

  try {
    const res = await fetch("/auth/signup", options);
    data = await res.json();

    console.log("data returned from signup: ", data);
  } catch (error) {
    console.error(error);
    data = { message: "fetchSignupError" };
  }

  dispatch({ type: SIGNUP, payload: data });

  // redirect user if signup successful and user is logged in
  if (data.id) history.push("/photos");
};

// get user -------------------------------------------------------------------------------------------------
export const getUser = () => async dispatch => {
  let data = null;

  try {
    const res = await fetch("/api/user");
    data = await res.json();
  } catch (error) {
    console.error(error);
  }

  dispatch({ type: GET_USER, payload: data });
};

// set username ----------------------------------------------------------------------------------------------
export const setUsername = (values, history) => async dispatch => {
  let data = null;

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values)
  };

  // will return true if success
  try {
    const res = await fetch("/api/set_username", options);
    data = await res.json();
    console.log(data);
    data = data.changedRows === 1 ? true : false;
  } catch (error) {
    console.error(error);
    data = false;
  }

  console.log(data);

  dispatch({ type: SET_USERNAME, payload: data });

  if (data) history.push("/");
};

// clear setUsername reducer to 'null' ----------------------------------------------------------------------
export const clearSetUsername = () => {
  return { type: CLEAR_SET_USERNAME, payload: null };
};

// checks to see if username entered is alphanumeric --------------------------------------------------------
export const checkAlphanumeric = username => {
  const result = alphanumericTest(username);

  return { type: CHECK_ALPHANUMERIC, payload: result };
};

// clear alphanumeric ---------------------------------------------------------------------------------------
export const clearAlphanumeric = () => {
  return { type: CHECK_ALPHANUMERIC, payload: null };
};

// toggle brand dropdown on/off ------------------------------------------------------------------------------
export const brandDropdownClick = value => {
  return { type: BRAND_DROPDOWN_CLICK, payload: value };
};

// toggle menu dropdown on/off -------------------------------------------------------------------------------
export const menuDropdownClick = value => {
  return { type: MENU_DROPDOWN_CLICK, payload: value };
};

// toggle formReview mode ------------------------------------------------------------------------------------
export const toggleFormReview = value => {
  return { type: TOGGLE_FORM_REVIEW, payload: value };
};

// send contact email ----------------------------------------------------------------------------------------
export const sendEmail = (values, history) => async dispatch => {
  let data = null;

  const options = {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(values)
  };

  try {
    const res = await fetch("/api/contact", options);
    data = await res.json();
  } catch (error) {
    console.error(error);
    data = { error, message: "There was an error. Please try again" };
  }

  history.push("/");

  dispatch({ type: SEND_EMAIL, payload: data });
};

// close email feedback modal --------------------------------------------------------------------------------
export const closeEmailModal = () => {
  return { type: CLOSE_EMAIL_MODAL };
};

// Get photos from db ----------------------------------------------------------------------------------------
export const getPhotos = (
  page,
  searchType = null,
  value = null
) => async dispatch => {
  let data = null;
  const searchTypeQuery =
    searchType !== null ? `&searchType=${searchType}&value=${value}` : "";
  try {
    const res = await fetch(`/api/photos?page=${page}${searchTypeQuery}`);
    data = await res.json();
  } catch (error) {
    console.error(error);
    data = {
      error,
      message: "There was an error fetching the photos. Please try again.",
      data: null
    };
  }

  dispatch({ type: GET_PHOTOS, payload: data });
};

// will get a single photo -----------------------------------------------------------------------------------
export const getPhoto = id => async dispatch => {
  let data = null;

  try {
    const res = await fetch(`/api/photos/${id}}`);
    data = await res.json();
  } catch (error) {
    console.error(error);
    data = {
      error,
      message: "There was an error fetching the photo. Please try again.",
      data: null
    };
  }

  dispatch({ type: GET_PHOTO, payload: data });
};

// will toggle like or unlike on click -----------------------------------------------------------------------
export const toggleLike = (photoId, value, type) => async dispatch => {
  let data = null;

  const body = { photoId, value, type };

  const options = {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(body)
  };

  try {
    const res = await fetch(`/api/photos/${photoId}/toggle_like`, options);
    data = await res.json();
  } catch (error) {
    console.error(error);
    data = {
      error,
      message: "There was an error. Please try again.",
      data: null
    };
  }

  dispatch({ type: TOGGLE_LIKE, payload: data });
};

// add photo -------------------------------------------------------------------------------------------------
export const addPhoto = (values, history) => async dispatch => {
  let data = null;

  const options = {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(values)
  };

  try {
    const res = await fetch("/api/photos/new", options);
    data = await res.json();
  } catch (error) {
    console.error(error);
    data = {
      error,
      message: "There was an error adding the photo. Please try again",
      data: null
    };
  }

  // make another check in. if payload here is null (failure) reducer will render error modal
  // on failure
  if (data.error || !data.data || (data.data && data.data.length !== 1)) {
    dispatch({ type: ADD_PHOTO, payload: null });
    history.push("/");
  } else {
    dispatch({ type: ADD_PHOTO, payload: data });
    const { id } = data.data[0];
    history.push(`/photos/${id}`);
  }
};

// set current page for pagination ----------------------------------------------------------------------------
export const setPage = value => {
  return { type: SET_PAGE, payload: value };
};

// add comment to a post --------------------------------------------------------------------------------------
export const addComment = values => async dispatch => {
  let data = null;

  const options = {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(values)
  };

  try {
    const res = await fetch("/api/comments/new", options);
    data = await res.json();
  } catch (error) {
    console.error(error);
    data = {
      error,
      message: "There was an error adding the comment. Please try again",
      data: null
    };
  }

  dispatch({ type: ADD_COMMENT, payload: data });
};

// toggle show likes modal ------------------------------------------------------------------------------------
export const toggleShowLikes = value => {
  return { type: TOGGLE_SHOW_LIKES, payload: value };
};

// set search type --------------------------------------------------------------------------------------------
export const setSearchType = obj => {
  return { type: SET_SEARCH_TYPE, payload: obj };
};

// edit photo -------------------------------------------------------------------------------------------------
export const editPhoto = (
  formValues,
  photoId,
  photoOwnerId,
  history
) => async dispatch => {
  let data = null;

  const options = {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ ...formValues, photoOwnerId })
  };

  try {
    const res = await fetch(`/api/photos/edit/${photoId}`, options);
    data = await res.json();
  } catch (error) {
    console.error(error);
    data = {
      error,
      message: "There was an error editing the photo. Please try again",
      data: null
    };
  }

  if (data.error || !data.data || (data.data && data.data.length !== 1)) {
    dispatch({ type: EDIT_PHOTO, payload: null });
    history.push("/");
  } else {
    dispatch({ type: EDIT_PHOTO, payload: data });
    history.push(`/photos/${photoId}`);
  }
};

// delete photo ----------------------------------------------------------------------------------------------
export const deletePhoto = (
  photoId,
  photoOwnerId,
  page,
  searchType,
  value,
  history
) => async dispatch => {
  let data = null;

  const options = {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ page, photoOwnerId, searchType, value })
  };

  try {
    const res = await fetch(`/api/photos/delete/${photoId}`, options);
    data = await res.json();
  } catch (error) {
    console.error(error);
    data = {
      error,
      message: "There was an error deleting the photo. Please try again",
      data: null
    };
  }

  console.log(data);

  if (data.error || !data.data || (data.data && !data.data.length)) data = null;

  dispatch({ type: DELETE_PHOTO, payload: data });

  if (!searchType) {
    history.push("/photos");
  } else {
    history.push(`/${searchType}/${value}/photos`);
  }
};
