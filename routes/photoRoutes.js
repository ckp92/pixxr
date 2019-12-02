const usePooledConnection = require("../services/mysql/usePooledConnection");
const generalQuery = require("../services/mysql/generalQuery");
const addPhoto = require("../services/photos/addPhoto");
const getPhotos = require("../services/photos/getPhotos");

module.exports = app => {
  // SHOW PHOTOS ROUTE ----------------------------------------------------------------------------------------
  app.get("/api/photos", async (req, res) => {
    console.log(req.query.page);
    const { page } = req.query;

    const response = await getPhotos(page);
    const { status, error, message, data } = response;

    res.status(status).send({ error, message, data });
  });

  // ADD NEW PHOTO ROUTE --------------------------------------------------------------------------------------
  app.post("/api/photos/new", async (req, res) => {
    const response = await addPhoto(req.body);
    const { status, error, message } = response;

    res.status(status).send({ error, message });
  });
};

// users 6 7 8 9 10 11 12
// photos: 18 19 20 21 22
