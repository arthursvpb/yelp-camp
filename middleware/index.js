var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

// Middleware to check campground ownership
middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        res.flash("error", "Campground not found.");
        res.redirect("back");
      } else {
        // does the user own the campground?
        // foundCampground.author.id -> mongoose object
        // req.user._id -> string
        // that's why we cant use "==="
        if (foundCampground.author.id.equals(req.user._id)) {
          // Passing to the edit.ejs view
          // // res.render("campgrounds/edit", { campground: foundCampground });
          // Move on to the rest of the code
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("back");
  }
};

// Middleware to check comment ownership
middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect("back");
      } else {
        // does the user own the comment?
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that.");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("back");
  }
};

// Middleware to make sure if the user is logged in
middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  // Before we redirect we pass the key and value to handle it on the route and the template
  // Add some data to the next route and the data won't persist on every sing request
  req.flash("error", "You need to be logged in to do that.");
  res.redirect("/login");
};

module.exports = middlewareObj;
