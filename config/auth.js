const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User model
require("../models/User");
const User = mongoose.model("users");

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      { usernameField: "email", passwordField: "password" },
      (email, password, done) => {
        User.findOne({ email: email })
          .then((user) => {
            if (!user) {
              return done(null, false, {
                message: "This user does not exist!",
              });
            }

            bcrypt.compare(password, user.password, (err, match) => {
              if (match) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Incorrect password!" });
              }
            });
          })
          .catch((err) => {
            req.flash(
              "error_msg",
              "There was an internal error perfoming authentication, please try again!"
            );
            res.redirect("/user/login");
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
