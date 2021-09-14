const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("admin/index");
});

router.get("/posts", (req, res) => {
  res.send("Posts page!");
});

router.get("/categories", (req, res) => {
  res.send("Categories page!");
});

module.exports = router;
