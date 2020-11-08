// We are not declare a variable app, we use the express-router
// We changed all variable app to router
var express = require("express");
// New instance of the express router, and adding all the routes to the router
// mergeParams -> merge the params from campground and the comments together, so that inside the comments routes,
// we are able to access the :id we defined
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Require the middleware
// We could require "../middleware/index" but since we gave the name
// index.js in the middleware folder, if we specify only middleware folder,
// it will work because index.js is a special name
var middleware = require("../middleware");

// =================================
// COMMENTS ROUTES
// =================================

// * NEW COMMENT ROUTE
router.get(
  "/campgrounds/:id/comments/new",
  middleware.isLoggedIn,
  (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
      if (err) {
        console.log(err);
      } else {
        res.render("comments/new", { campground: campground });
      }
    });
  }
);

// * CREATE COMMENT ROUTE
router.post("/campgrounds/:id/comments/", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash("error", "Something went wrong");
          console.log(err);
        } else {
          // Add Username and Id to Comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // Save comment
          comment.save();
          // Push into the comments
          campground.comments.push(comment);
          campground.save();

          req.flash("success", "Successfully added comment");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// * EDIT COMMENT ROUTE
router.get(
  "/campgrounds/:id/comments/:comment_id/edit",
  middleware.checkCommentOwnership,
  (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        res.render("comments/edit", {
          campground_id: req.params.id,
          comment: foundComment,
        });
      }
    });
  }
);

// * UPDATE COMMENT ROUTE
router.put(
  "/campgrounds/:id/comments/:comment_id/",
  middleware.checkCommentOwnership,
  (req, res) => {
    Comment.findByIdAndUpdate(
      req.params.comment_id,
      req.body.comment,
      (err, updatedComment) => {
        if (err) {
          res.redirect("back");
        } else {
          res.redirect("/campgrounds/" + req.params.id);
        }
      }
    );
  }
);

// * DESTROY COMMENT ROUTE
router.delete(
  "/campgrounds/:id/comments/:comment_id/",
  middleware.checkCommentOwnership,
  (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
      if (err) {
        res.redirect("back");
      } else {
        // Removed
        req.flash("success", "Comment deleted.");
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
  }
);

module.exports = router;
