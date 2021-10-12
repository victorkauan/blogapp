if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI:
      "mongodb+srv://victorkauan:1q2w3e4r5t@blogapp-prod.y6y6w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  };
} else {
  module.exports = { mongoURI: "mongodb://localhost/blogapp" };
}
