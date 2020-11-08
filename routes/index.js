// We are not declare a variable app, we use the express-router
// We changed all variable app to router
var express = require("express");
// New instance of the express router, and adding all the routes to the router
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Home Page
router.get("/", (req, res) => {
  console.log(`/ accessed by ${req.ip}`);

  res.render("landing");
});

// ===========
// AUTH ROUTES
// ===========

// Show register form
router.get("/register", (req, res) => {
  res.render("register");
});

// Sign up logic
router.post("/register", (req, res) => {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    // Login user in
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Successfully registered "+ user.username);
      res.redirect("/campgrounds");
    });
  });
});

// Show login form
router.get("/login", (req, res) => {
  res.render("login");
});

// Login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.send("Login logic happens here");
  }
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out");
  res.redirect("/campgrounds");
});

// // Middleware to make sure if the user is logged in
// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect("/login");
// }

// 404 Page
// router.get("*", (req, res) => res.send("Page not found!"));

module.exports = router;
