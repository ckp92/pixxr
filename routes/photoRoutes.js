const usePooledConnection = require("../services/mysql/usePooledConnection");
const generalQuery = require("../services/mysql/generalQuery");
const addPhoto = require("../services/photos/addPhoto");
const getPhotos = require("../services/photos/getPhotos");
const getPhoto = require("../services/photos/getPhoto");

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

  // GET SINGLE PHOTO ROUTE
  app.get("/api/photos/:id", async (req, res) => {
    const { id } = req.params;

    const response = await getPhoto(id, req.user.id);
    const { status, error, message, data } = response;

    res.status(status).send({ error, message, data });
  });
};

// args: userId, type, page=null

// users 6 7 8 9 10 11 12
// photos: 18 19 20 21 22
