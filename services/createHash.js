const bcrypt = require("bcrypt");

module.exports = async pass => {
  const saltRounds = 10;
  let hashedPass = null;

  try {
    hashedPass = await bcrypt.hash(pass, saltRounds);
  } catch (error) {
    console.error(error);
    hashedPass = "createHashError";
  }

  return hashedPass;
};
