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
  TOGGLE_LIKE
} from "./types";

import alphanumericTest from "../utils/alphanumericTest";

export const toggleLanding = value => {
  return { type: TOGGLE_LANDING, payload: value };
};

// will check to see if username is unique
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

// will be either 'login' or 'signup' depending on what user selects
export const toggleSignupMode = value => {
  return { type: SIGNUP_MODE, payload: value };
};

// login
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

// signup
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

// get user
export const getUser = () => async dispatch => {
  let data = null;

  try {
    const res = await fetch("/api/user");
    data = await res.json();
  } catch (error) {
    console.error(error);
  }

  // fetch doesn't accept empty response. If response is empty (undefined), error will get caught by 'catch' block and 'data' will remain as null

  dispatch({ type: GET_USER, payload: data });
};

// set username
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

// clear setUsername reducer to 'null'
export const clearSetUsername = () => {
  return { type: CLEAR_SET_USERNAME, payload: null };
};

// checks to see if username entered is alphanumeric
export const checkAlphanumeric = username => {
  const result = alphanumericTest(username);

  return { type: CHECK_ALPHANUMERIC, payload: result };
};

// clear alphanumeric
export const clearAlphanumeric = () => {
  return { type: CHECK_ALPHANUMERIC, payload: null };
};

// toggle brand dropdown on/off
export const brandDropdownClick = value => {
  return { type: BRAND_DROPDOWN_CLICK, payload: value };
};

// toggle menu dropdown on/off
export const menuDropdownClick = value => {
  return { type: MENU_DROPDOWN_CLICK, payload: value };
};

// toggle formReview mode
export const toggleFormReview = value => {
  return { type: TOGGLE_FORM_REVIEW, payload: value };
};

// send contact email
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

// close email feedback modal
export const closeEmailModal = () => {
  return { type: CLOSE_EMAIL_MODAL };
};

// Get photos from db
export const getPhotos = (page, userId = null) => async dispatch => {
  let data = null;
  const userIdQuery = userId !== null ? `&userId=${userId}` : "";
  try {
    const res = await fetch(`/api/photos?page=${page}${userIdQuery}`);
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

// will get a single photo
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

// will toggle like or unlike on click
export const toggleLike = async (
  value,
  userId,
  type,
  page = null
) => async dispatch => {
  let data = null;

  const body = { value, userId, type, page };

  const options = {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(body)
  };

  try {
    const res = await fetch("/api/photo/toggle_like");
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
