const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
require("../models/User");
const User = mongoose.model("users");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", (req, res) => {
  let errors = [];

  if (
    !req.body.name ||
    typeof req.body.name === undefined ||
    req.body.name === null
  ) {
    errors.push({ message: "Invalid name!" });
  }

  if (
    !req.body.email ||
    typeof req.body.email === undefined ||
    req.body.email === null
  ) {
    errors.push({ message: "Invalid e-mail!" });
  }

  if (
    !req.body.password ||
    typeof req.body.password === undefined ||
    req.body.password === null
  ) {
    errors.push({ message: "Invalid password!" });
  } else if (req.body.password.length < 4) {
    errors.push({ message: "Password too short!" });
  }

  if (req.body.password !== req.body.password2) {
    errors.push({ message: "Passwords are different, try again!" });
  }

  if (errors.length > 0) {
    res.render("users/register", { errors: errors });
  } else {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          req.flash(
            "error_msg",
            "There is already an account registered with this email in our system!"
          );
          res.redirect("/user/register");
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) {
                req.flash("error_msg", "There was an error saving the user!");
                res.redirect("/user/register");
              } else {
                newUser.password = hash;

                newUser
                  .save()
                  .then(() => {
                    req.flash("success_msg", "User created successfully!");
                    res.redirect("/");
                  })
                  .catch((err) => {
                    req.flash(
                      "error_msg",
                      "There was an error creating the user, please try again!"
                    );
                    res.redirect("/user/register");
                  });
              }
            });
          });
        }
      })
      .catch((err) => {
        req.flash("error_msg", "There was an internal error!");
        res.redirect("/");
      });
  }
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true,
  })(req, res, next);
});

module.exports = router;
