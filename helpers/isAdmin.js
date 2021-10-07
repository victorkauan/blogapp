module.exports = {
  isAdmin: function (req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin === 1) {
      return next();
    }

    req.flash("error_msg", "You must be an administrator to access this page!");
    res.redirect("/");
  },
};
