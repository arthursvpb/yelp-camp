const express = require("express"),
  app = express(),
  port = process.env.PORT;
  // port = 8000;
var bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds");

// Importing the 3 routes files
var commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  indexRoutes = require("./routes/index");

// Connect to the Database
mongoose.set("useUnifiedTopology", true);
mongoose
  .connect(
    "",
    { useNewUrlParser: true, useCreateIndex: true }
  )
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch((err) => {
    console.log(err.message);
  });
// mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Tell express to serve public directory
// ! Very nice tip is to use __dirname, it tells the absolute path of the directory containing the currently executing file.
app.use(express.static(__dirname + "/public"));

// Using method-override
app.use(methodOverride("_method"));

// Flash Messages
app.use(flash());

// Run the SeedDB file
// // seedDB();

// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "Wubba lubba dub dub",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// * Passing a variable to all members of EJS template
// * Our middleware: wherever function we provide to it, will be called on every route
// Id and ID of the current logged in user
// if req.user is undefined there is no user logged in
// When the user logged in, passport will create req.user and put the user data inside of it.
// req.user();
app.use((req, res, next) => {
  // pass req.user to every single template
  // * wherever we put in res.locals is what is available inside of the template
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  // * move on to the actual next code (purpose of the middleware)
  next();
});

// ! Use the 3 routes files we required (imported)
// We can do app.use("/campgrouds", campgroundRoutes);
// This will append "/campgrounds" on all campgroundRoutes
// Avoiding code duplication
// But we still have to take off every /campgrounds from the campgrounds.js file
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
