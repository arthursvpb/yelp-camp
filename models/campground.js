// Schema setup
var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
  comments: [
    {
      // ID of the comment
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

// Compiling into a model
var Campground = new mongoose.model("Campground", campgroundSchema);

module.exports = Campground;
