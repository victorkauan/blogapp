const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Category");
const Category = mongoose.model("categories");
require("../models/Post");
const Post = mongoose.model("posts");

router.get("/", (req, res) => {
  res.render("admin/index");
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

router.get("/categories/edit/:id", (req, res) => {
  Category.findOne({ _id: req.params.id })
    .lean()
    .then((category) => {
      res.render("admin/editcategories", { category: category });
    })
    .catch((err) => {
      req.flash("error_msg", "This category does not exist!!");
      res.redirect("/admin/categories");
    });
});

router.post("/categories/edit", (req, res) => {
  Category.findOne({ _id: req.body.id })
    .then((category) => {
      category.name = req.body.name;
      category.slug = req.body.slug;

      category
        .save()
        .then(() => {
          req.flash("success_msg", "Category edited successfully!");
          res.redirect("/admin/categories");
        })
        .catch((err) => {
          req.flash(
            "error_msg",
            "There was an internal error saving the category edit!"
          );
          res.redirect("/admin/categories");
        });
    })
    .catch((err) => {
      req.flash("error_msg", "There was an error editing the category!");
      res.redirect("/admin/categories");
    });
});

router.post("/categories/delete", (req, res) => {
  Category.deleteOne({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Category successfully deleted!");
      res.redirect("/admin/categories");
    })
    .catch((err) => {
      req.flash("error_msg", "There was an error deleting the category!");
      res.redirect("/admin/categories");
    });
});

router.get("/posts", (req, res) => {
  Post.find()
    .lean()
    .populate("category")
    .sort({ date: "desc" })
    .then((posts) => {
      res.render("admin/posts", { posts: posts });
    })
    .catch((err) => {
      req.flash("error_msg", "There was an error listing the posts!");
      res.redirect("/admin");
    });
});

router.get("/posts/add", (req, res) => {
  Category.find()
    .lean()
    .then((categories) => {
      res.render("admin/addposts", { categories: categories });
    })
    .catch((err) => {
      req.flash("error_msg", "There was an error loading the form!");
      res.redirect("/admin/posts");
    });
});

router.post("/posts/new", (req, res) => {
  let errors = [];

  if (req.body.category === "0") {
    errors.push({ message: "Invalid category, register a category!" });
  }

  if (errors.length > 0) {
    res.render("admin/addposts", { errors: errors });
  } else {
    const newPost = {
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description,
      content: req.body.content,
      category: req.body.category,
    };

    new Post(newPost)
      .save()
      .then(() => {
        req.flash("success_msg", "Post created successfully!");
        res.redirect("/admin/posts");
      })
      .catch((err) => {
        req.flash("error_msg", "There was an error saving the post!");
        res.redirect("/admin/posts");
      });
  }
});

router.get("/posts/edit/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .lean()
    .then((post) => {
      Category.find()
        .lean()
        .then((categories) => {
          res.render("admin/editposts", { post: post, categories: categories });
        })
        .catch((err) => {
          req.flash("error_msg", "There was an error listing the categories!");
          res.redirect("/admin/posts");
        });
    })
    .catch((err) => {
      req.flash("error_msg", "There was an error loading the edit form!");
      res.redirect("/admin/posts");
    });
});

router.post("/posts/edit", (req, res) => {
  Post.findOne({ _id: req.body.id })
    .then((post) => {
      post.title = req.body.title;
      post.slug = req.body.slug;
      post.description = req.body.description;
      post.content = req.body.content;
      post.category = req.body.category;

      post
        .save()
        .then(() => {
          req.flash("success_msg", "Post successfully edited!");
          res.redirect("/admin/posts");
        })
        .catch(() => {
          req.flash(
            "error_msg",
            "There was an internal error saving the edit!"
          );
          res.redirect("/admin/posts");
        });
    })
    .catch((err) => {
      req.flash("error_msg", "There was an error saving the edit!");
      res.redirect("/admin/posts");
    });
});

module.exports = router;
