module.exports = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .send({ error: "you need to be logged in to do that" });
  }

  next();
};
