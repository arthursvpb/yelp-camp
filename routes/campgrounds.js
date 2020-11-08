// We are not declare a variable app, we use the express-router
// We changed all variable app to router
var express = require("express");
// New instance of the express router, and adding all the routes to the router
var router = express.Router();
var Campground = require("../models/campground");

// Require the middleware
// We could require "../middleware/index" but since we gave the name
// index.js in the middleware folder, if we specify only middleware folder,
// it will work because index.js is a special name
var middleware = require("../middleware");

// ! INDEX ROUTE Campgrounds
router.get("/campgrounds", (req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
    }
  });
});

// Following the conventions RESTful
// The post URL should be the same as the get one.
// ! CREATE ROUTE
router.post("/campgrounds", middleware.isLoggedIn, (req, res) => {
  // We need npm install body-parser

  // ! Get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  var newCampground = {
    name: name,
    image: image,
    description: desc,
    author: author,
  };

  // // ! pushing into the array
  // //  campgrounds.push(newCampground);

  // Create a new campground and save to database
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      // ! redirect back to campgrounds page
      res.redirect("/campgrounds");
      console.log("Created: " + newlyCreated);
    }
  });
});

// Show the form that send the data to the post route.
// ! NEW ROUTE
router.get("/campgrounds/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// ? Shows more info about one campground
// ! SHOW ROUTE
router.get("/campgrounds/:id", (req, res) => {
  // Find the campground with provided ID and render the template of campground
  // Mongoose method
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
        res.send("This campground doesn't exist");
      } else {
        console.log(foundCampground);
        // Render the show template with that campground
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

// ! EDIT CAMPGROUND ROUTE
router.get(
  "/campgrounds/:id/edit",
  middleware.checkCampgroundOwnership,
  (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
      // Passing to the edit.ejs view
      res.render("campgrounds/edit", { campground: foundCampground });
    });
  }
);

// ! UPDATE CAMPGROUND ROUTE
router.put(
  "/campgrounds/:id",
  middleware.checkCampgroundOwnership,
  (req, res) => {
    // Find and update the correct campground
    // req.body.campground.body = req.sanitize(req.body.campground.body);
    Campground.findByIdAndUpdate(
      req.params.id,
      req.body.campground,
      (err, updatedCampground) => {
        if (err) {
          console.log("Error." + err);
        } else {
          res.redirect(`/campgrounds/${req.params.id}`);
        }
      }
    );
  }
);

// ! DESTROY CAMPGROUND ROUTE
router.delete(
  "/campgrounds/:id",
  middleware.checkCampgroundOwnership,
  (req, res) => {
    // DELETING USING MONGOOSE
    Campground.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
        res.redirect("/campgrounds");
      } else {
        res.redirect("/campgrounds");
      }
    });
  }
);

module.exports = router;
