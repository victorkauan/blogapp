const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Category");
const Category = mongoose.model("categories");

router.get("/", (req, res) => {
  res.render("admin/index");
});

router.get("/posts", (req, res) => {
  res.send("Posts page!");
});

router.get("/categories", (req, res) => {
  Category.find()
    .lean()
    .sort({ date: "desc" })
    .then((categories) => {
      res.render("admin/categories", { categories: categories });
    })
    .catch((err) => {
      req.flash("error_msg", "There was an error listing the categories!");
      res.redirect("/admin");
    });
});

router.get("/categories/add", (req, res) => {
  res.render("admin/addcategories");
});

router.post("/categories/new", (req, res) => {
  // Validation
  let errors = [];

  // |> Name
  if (
    !req.body.name ||
    typeof req.body.name === undefined ||
    req.body.name === null
  ) {
    errors.push({ message: "Invalid name!" });
  } else if (req.body.name.length < 2) {
    errors.push({ message: "Category name too small!" });
  }

  // |> Slug
  if (
    !req.body.slug ||
    typeof req.body.slug === undefined ||
    req.body.slug === null
  ) {
    errors.push({ message: "Invalid slug!" });
  }

  if (errors.length > 0) {
    res.render("admin/addcategories", { errors: errors });
  } else {
    const newCategory = {
      name: req.body.name,
      slug: req.body.slug,
    };

    new Category(newCategory)
      .save()
      .then(() => {
        req.flash("success_msg", "Category created successfully!");
        res.redirect("/admin/categories");
      })
      .catch((err) => {
        req.flash(
          "error_msg",
          "There was an error saving the category, please try again!"
        );
        res.redirect("/admin/categories");
      });
  }
});

module.exports = router;
