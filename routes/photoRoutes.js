const addPhoto = require("../services/photos/addPhoto");
const getPhotos = require("../services/photos/getPhotos");
const getPhotoMin = require("../services/photos/getPhotoMin");
const getPhotoFull = require("../services/photos/getPhotoFull");
const toggleLike = require("../services/photos/toggleLike");

module.exports = app => {
  // SHOW PHOTOS ROUTE ----------------------------------------------------------------------------------------
  app.get("/api/photos", async (req, res) => {
    // e.g. /api/photos?page=0&userId=6
    // if no userId, getPhotos will set it to 'null' and it will get ALL photos
    const { page, userId } = req.query;

    const response = await getPhotos(page, req.user.id, userId);
    const { status, error, message, data } = response;

    res.status(status).send({ error, message, data });
  });

  // ADD NEW PHOTO ROUTE --------------------------------------------------------------------------------------
  app.post("/api/photos/new", async (req, res) => {
    const response = await addPhoto(req.body);
    const { status, error, message } = response;

    res.status(status).send({ error, message });
  });

  // GET SINGLE PHOTO ROUTE -----------------------------------------------------------------------------------
  app.get("/api/photos/:id", async (req, res) => {
    const { id } = req.params;

    const response = await getPhotoFull(id, req.user.id);
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
};
