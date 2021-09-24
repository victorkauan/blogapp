const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
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
    // Registering user in the database
  }
});

module.exports = router;
