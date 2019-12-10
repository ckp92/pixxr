const mailgun = require("mailgun-js");
const keys = require("../config/keys");
const usePooledConnection = require("../services/mysql/usePooledConnection");
const generalQuery = require("../services/mysql/generalQuery");

const mg = mailgun({ apiKey: keys.mailgunAPI, domain: keys.mailgunDomain });

module.exports = app => {
  app.post("/api/contact", async (req, res) => {
    const { senderName, userId, senderEmail, body } = req.body;

    // build subject line string
    const subjectLine = () => {
      // use 'PROD' or 'DEV' accordingly
      let str = `${process.env.NODE_ENV === "production" ? "PROD" : "DEV"}`;
      // add app identifier
      str += "-PIXXR-MESSAGE";

      return str;
    };

    // message obj
    const data = {
      from: `${senderName} <${senderEmail}>`,
      to: "cpatel818@gmail.com",
      subject: subjectLine(),
      text: body
    };

    // send email
    const info = await mg
      .messages()
      .send(data)
      .catch(err => {
        console.error(err);
        res.status(400).send({
          error: err,
          message: "There was an error. Please try again"
        });
      });

    // log mailgun response
    console.log(info);

    // will save to db even if not send
    // if not sent, will set successfullyDelivered as false

    const queryStr = `INSERT INTO contact_messages (user_id, return_email, message_body, successfully_delivered) VALUES (?, ?, ?, ?)`;

    // if not sent, info will be undefined
    const args = [userId, senderEmail, body, !!info];

    const messageOkPacket = await usePooledConnection(
      generalQuery,
      queryStr,
      args
    ).catch(error => {
      console.error("Error saving new CONTACT MESSAGE to db:", error);
    });

    console.log(messageOkPacket);

    res.send({ success: "success", message: "Message sent successfully" });
  });
};
