const bcrypt = require("bcrypt");

module.exports = async (pass, hash) => {
  let match = null;
  try {
    match = await bcrypt.compare(pass, hash);

    match = match ? "correct" : "incorrect";
  } catch (error) {
    console.error(error);
    match = "checkPassError";
  }

  return match;
};
