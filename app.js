// Loading modules
const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const admin = require("./routes/admin");
const user = require("./routes/user");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
require("./config/auth")(passport);
require("./models/Post");
const Post = mongoose.model("posts");
require("./models/Category");
const Category = mongoose.model("categories");

// Configurations
// |> Session
app.use(
  session({
    secret: "nodecourse",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// |> Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// |> Handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// |> bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// |> Mongoose
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost/blogapp")
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((err) => {
    console.log("There was an error connecting to MongoDB: " + err);
  });

// |> Public
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  Post.find()
    .lean()
    .populate("category")
    .sort({ date: "desc" })
    .then((posts) => {
      res.render("index", { posts: posts });
    })
    .catch((err) => {
      req.flash("error_msg", "There was an internal error!");
      res.redirect("/404");
    });
});

app.get("/post/:slug", (req, res) => {
  Post.findOne({ slug: req.params.slug })
    .lean()
    .populate("category")
    .then((post) => {
      if (post) {
        res.render("post/index", { post: post });
      } else {
        req.flash("error_msg", "This post does not exist!");
        res.redirect("/");
      }
    })
    .catch((err) => {
      req.flash("error_msg", "There was an internal error!");
      res.redirect("/");
    });
});

app.get("/categories", (req, res) => {
  Category.find()
    .lean()
    .sort({ name: "asc" })
    .then((categories) => {
      res.render("categories/index", { categories: categories });
    })
    .catch((err) => {
      req.flash("There was an internal error listing the categories!");
      res.redirect("/");
    });
});

app.get("/categories/:slug", (req, res) => {
  Category.findOne({ slug: req.params.slug })
    .lean()
    .then((category) => {
      if (category) {
        Post.find({ category: category._id })
          .lean()
          .sort({ date: "desc" })
          .then((posts) => {
            res.render("categories/posts", {
              category: category,
              posts: posts,
            });
          })
          .catch((err) => {
            req.flash("error_msg", "There was an error listing the posts!");
            res.redirect("/categories");
          });
      } else {
        req.flash("error_msg", "This category does not exist!");
        res.redirect("/categories");
      }
    })
    .catch((err) => {
      req.flash(
        "error_msg",
        "There was an internal error loading this category's page!"
      );
      res.redirect("/categories");
    });
});

app.get("/404", (req, res) => {
  res.send("Error 404!");
});

app.use("/admin", admin);

app.use("/user", user);

// Others
const PORT = 8081;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT + "!");
});
