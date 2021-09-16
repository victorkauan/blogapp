// Loading modules
const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const admin = require("./routes/admin");
const path = require("path");

// Configurations
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

// Middlewares
app.use((req, res, next) => {
  console.log("Hi, I'm a middleware!");
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("Main route!");
});

app.get("/posts", (req, res) => {
  res.send("Post list!");
});

app.use("/admin", admin);

// Others
const PORT = 8081;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT + "!");
});
