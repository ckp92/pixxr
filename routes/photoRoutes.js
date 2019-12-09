const addPhoto = require("../services/photos/addPhoto");
const countPhotos = require("../services/photos/countPhotos");
const getPhotos = require("../services/photos/getPhotos");
const getPhotoMin = require("../services/photos/getPhotoMin");
const getPhotoFull = require("../services/photos/getPhotoFull");
const toggleLike = require("../services/photos/toggleLike");
const addComment = require("../services/photos/addComment");
const editPhoto = require("../services/photos/editPhoto");

module.exports = app => {
  // SHOW PHOTOS ROUTE ----------------------------------------------------------------------------------------
  app.get("/api/photos", async (req, res) => {
    const { id } = req.user;
    const { page, searchType, value } = req.query;

    // get total number of photos
    const total = await countPhotos(searchType, value);

    const response = await getPhotos(page, id, searchType, value);
    const { status, error, message, data } = response;

    res.status(status).send({ error, message, total, data });
  });

  // ADD NEW PHOTO ROUTE --------------------------------------------------------------------------------------
  app.post("/api/photos/new", async (req, res) => {
    const { id } = req.user;

    // add photo + tags and get insertId of photo
    const photoId = await addPhoto(req.body, id);

    // get full photo data
    const response = await getPhotoFull(photoId, id);
    const { status, error, message, data } = response;

    res.status(status).send({ error, message, data });
  });

  // GET SINGLE PHOTO ROUTE -----------------------------------------------------------------------------------
  app.get("/api/photos/:id", async (req, res) => {
    const { id } = req.user;
    const photoId = req.params.id;

    const response = await getPhotoFull(photoId, id);
    const { status, error, message, data } = response;

    res.status(status).send({ error, message, data });
  });

  // TOGGLE LIKE ROUTE ----------------------------------------------------------------------------------------
  app.post("/api/photos/:id/toggle_like", async (req, res) => {
    const { id } = req.user;
    const { photoId, value, type } = req.body;

    // update the like
    await toggleLike(photoId, id, value);

    let response = null;

    // get photo data with different properties depending on type
    if (type === "single") {
      response = await getPhotoFull(photoId, id);
    } else if (type === "multi") {
      response = await getPhotoMin(photoId, id);
    }

    const { status, error, message, data } = response;

    res.status(status).send({ error, message, data });
  });

  // ADD COMMENT ROUTE ---------------------------------------------------------------------------------------
  app.post("/api/comments/new", async (req, res) => {
    const { id } = req.user;
    const { commentText, photoId } = req.body;

    // add the comment
    await addComment(id, photoId, commentText);

    // get new photo object
    const response = await getPhotoFull(photoId, id);

    const { status, error, message, data } = response;

    res.status(status).send({ error, message, data });
  });

  // EDIT PHOTO ROUTE ----------------------------------------------------------------------------------------
  app.post("/api/photos/edit/:id", async (req, res) => {
    const { id } = req.user;
    const { photoOwnerId } = req.body;
    const photoId = req.params.id;

    if (photoOwnerId === id) {
      // edit photo
      await editPhoto(req.body, photoId);
    } else {
      console.error("User doesn't own photo");
    }

    // get new photo object
    const response = await getPhotoFull(photoId, id);
    const { status, error, message, data } = response;

    res.status(status).send({ error, message, data });
  });
};
