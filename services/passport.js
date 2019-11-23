const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const usePooledConnection = require("./mysql/usePooledConnection"); // optional args must be array
const generalQuery = require("./mysql/generalQuery");
const createHash = require("./createHash");
const checkPass = require("./checkPass");

// serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize user
passport.deserializeUser(async (id, done) => {
  const queryStr = `SELECT * FROM users WHERE id = ?`;

  try {
    const rows = await usePooledConnection(generalQuery, queryStr, [id]);
    console.log("Found user to deserialize:", rows);
    done(null, rows[0]);
  } catch (error) {
    console.error("error deserializing:", error);
    done(error);
  }
});

// GLOBAL QUERY STRINGS ----------------------------------------------------------------------------------
const findUserByEmailStr = `SELECT *
FROM users
INNER JOIN local_account
ON users.id = local_account.local_user_id
WHERE local_account.local_email = ?`;

// LOCAL SIGNUP ------------------------------------------------------------------------------------------
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      // override username with email
      usernameField: "email",
      passwordField: "password",
      proxy: true
    },
    async (email, password, done) => {
      if (email) email = email.toLowerCase();

      let findUserRows = null;

      // find user in db with that email
      try {
        findUserRows = await usePooledConnection(
          generalQuery,
          findUserByEmailStr,
          [email]
        );
      } catch (error) {
        console.error("Error checking if user already exists: ", error);
        return done(err);
      }

      // don't make new user if email already exists in db
      if (findUserRows.length) {
        console.log(
          `A user with that email ('${email}') already exists in the db: ${findUserRows}`
        );
        return done(null, false, { message: "Email already exists" });
      }

      // continue and make new user if email doesn't already exist in db
      console.log(
        `Email doesn't already exist in db: ${findUserRows}. Making new user.`
      );

      const newUserQueryStr = "INSERT INTO users(type) VALUES(?)";
      const newUserArgs = ["local"];
      let newUserOkPacket = null;

      // add new user to 'users'
      try {
        newUserOkPacket = await usePooledConnection(
          generalQuery,
          newUserQueryStr,
          newUserArgs
        );
      } catch (error) {
        console.error("Error adding new user to 'users': ", error);
        return done(err);
      }

      // new user successfully added to 'users'
      console.log("New user added successfully to 'users': ", newUserOkPacket);

      // build (incomplete) newUserObj to be passed back with 'done()'
      const newUser = {
        id: newUserOkPacket.insertId,
        type: "local",
        local_id: null,
        local_email: email
      };

      // get hash of password
      const pass = await createHash(password);

      const newLocalAccountQueryStr =
        "INSERT INTO local_account(local_email, local_hash, local_user_id) VALUES (?, ?, ?)";
      const newLocalAccountArgs = [email, pass, newUser.id];
      let newLocalAccountOkPacket = null;

      // add new user to 'local_account'
      try {
        newLocalAccountOkPacket = await usePooledConnection(
          generalQuery,
          newLocalAccountQueryStr,
          newLocalAccountArgs
        );
      } catch (error) {
        console.error("Error adding new user to 'local_account': ", error);
        return done(err);
      }

      // new user successfully added to 'local_account'
      console.log(
        "New user added successfully to 'local_account': ",
        newLocalAccountOkPacket
      );

      // complete newUserObj
      newUser.local_id = newLocalAccountOkPacket.insertId;

      // return
      return done(null, newUser);
    }
  )
);

// LOCAL LOGIN ---------------------------------------------------------------------------------------------
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      proxy: true
    },
    async (email, password, done) => {
      let findUserRows = null;

      // find user in the db
      try {
        findUserRows = await usePooledConnection(
          generalQuery,
          findUserByEmailStr,
          [email]
        );
      } catch (error) {
        console.error(`Error finding user ('${email}') in database: `, error);
        return done(err);
      }

      // no user found in db
      if (!findUserRows.length) {
        console.log(`Account ('${email}') doesn't exist`);
        return done(null, false, { message: "Account doesn't exist" });
      }

      // user found in db
      console.log(`User ('${email}') found`);

      // compare passwords
      const passwordFeedback = await checkPass(
        password,
        findUserRows[0].local_hash
      );
      console.log("passwordFeedback: ", passwordFeedback);

      switch (passwordFeedback) {
        case "incorrect":
        case "checkPassError":
          console.error(passwordFeedback);
          return done(null, false, { message: passwordFeedback });
        // correct pass
        default:
          console.log("pass correct. logging in");
          return done(null, findUserRows[0]);
      }
    }
  )
);
