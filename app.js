// Loading modules
const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
const app = express();

// Configurations
// |> Handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// |> bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// |> Mongoose
// COMING SOON

// Routes

// Others
const PORT = 8081;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT + "!");
});
