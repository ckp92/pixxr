import React from "react";

export default [
  {
    heading: "General",
    list: [
      <div className="list-item">
        PIXXR is a photo-sharing social media application, where users can add
        the URLs of photos they wish to share, they can Edit and Delete their
        own photo, and they can 'like' and comment on any photo.
      </div>,
      <div className="list-item">
        Alongside being able to see all the photos and their own photos, users
        can view other users' photos by clicking on their usernames. Users can
        also view all photos containing a certain tag by clicking that tag.
      </div>,
      <div className="list-item">
        This project took around 5 weeks to complete. I found it quite
        challenging but I learned a lot seeing it through to completion!
      </div>,
      <div className="list-item">The front-end uses React and Redux</div>,
      <div className="list-item">The the back-end uses Nodejs and Express</div>,
      <div className="list-item">
        This web app uses MySQL as opposed to MongoDB because the data is
        relational.
      </div>
    ]
  },
  {
    heading: "Useage",
    list: [
      <div className="list-item">
        To add a new photo, click 'Add Photo' and enter a valid image URL, a
        title and at least one tag.
      </div>,
      <div className="list-item">
        Image URLs and titles must be a maximum of 250 characters long.
      </div>,
      <div className="list-item">
        Image URL structure will be checked for validity, so something like
        'google' or 'google.' will be rejected.
      </div>,
      <div className="list-item">
        Each tag must be separated by a comma (and optionally a space) and must
        only contain alphanumeric characters.
      </div>,
      <div className="list-item">
        Users can edit and delete photos with{" "}
        <i className="fas fa-pencil-alt" /> and{" "}
        <i className="far fa-trash-alt" />. These will only appear on photos
        which a user owns.
      </div>
    ]
  },
  {
    heading: "What Went Well",
    list: [
      <div className="list-item">
        <span className="first-line">
          Turning the mysql package's callback function into a promise.
        </span>{" "}
        In order to avoid 'callback-hell' I turned the callback into a promise.
        Each time this is invoked, it gets a new connection from the pool and
        then uses it to invoke another promise which is provided as an argument.{" "}
        <strong>This second promise is the actual query.</strong> Upon
        completion, it releases the connection. Doing things this way was a lot
        better because it made it possible to use async/await syntax for cleaner
        code, and because I didn't have to worry about making + releasing a new
        connection each time - that was done automatically.
      </div>,
      <div className="list-item">
        <span className="first-line">Navigating via RESTful routing.</span>{" "}
        RESTful routing was used on both the React-Router side and the Express
        side (via the api).
      </div>,
      <div className="list-item">
        <span className="first-line">Using Redux to manage the state.</span>{" "}
        Having a 'single-source-of-truth' was incredibly useful here, be it in
        the form of 'switches' to activate/deactivate modals, or actual data
        being sent back from the server. There are a lot of components here and
        Redux makes it so easy to manage all the state, expecially with Redux
        DevTools installed.
      </div>
    ]
  },
  {
    heading: "What Was Difficult",
    list: [
      <div className="list-item">
        <span className="first-line">
          Setting up authentication with Facebook and Twitter.
        </span>{" "}
        Facebook and Twitter require all authentication to be done over https
        and not http. The development environment for this project uses http but
        the production uses https. This meant that any tests that needed to be
        done for Facebook and Twitter authentication could not be done in the
        development environment. Instead, I had to deploy the app to heroku and
        view the heroku logs, <strong>every single time</strong>. Fortunately
        after successfully implementing Google authentication (which was ok with
        using http), the other two followed a similar pattern.
      </div>,
      <div className="list-item">
        <span className="first-line">
          Finding a reliable way to get an online instance of MySQL.
        </span>{" "}
        After googling around, I came across the{" "}
        <a
          href="https://aws.amazon.com/rds/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Amazon Relational Database Service (RDS)
        </a>{" "}
        which lets new users use a free tier of the service for 12 months. It
        was confusing to set up and to figure out exactly which certificates
        were needed, but it works just fine now.
      </div>,
      <div className="list-item">
        <span className="first-line">Styling. CSS is not my strong suit.</span>{" "}
        I tried to challenge myself with the styling, and I am happy with the
        way things look. That being said, it took a lot of time, and a lot of
        refactoring.
      </div>
    ]
  }
];
