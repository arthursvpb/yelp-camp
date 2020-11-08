// Seed our database with some data
// Emp´ty everything in database to start and add comments
// More modern wait to right this code https://www.youtube.com/watch?v=D_q-sQCdZXw&t=383s

var mongoose = require("mongoose"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment");

var data = [
  {
    name: "Floresta Proibida",
    image: "https://ogimg.infoglobo.com.br/in/20845105-28b-88c/FT1086A/652/x3C9161E700000578-0-image-a-29_1485524258761.jpg.pagespeed.ic.a4P9qlWQ4N.jpg",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam velit voluptas quidem itaque praesentium at est, voluptatum magnam harum veniam necessitatibus eligendi nihil beatae. Nesciunt quis, saepe eligendi corporis ipsa magnam odit? Iste exercitationem ut commodi assumenda optio, accusamus neque?"
  },
  {
    name: "Ilha de Lost",
    image: "https://observatoriodocinema.bol.uol.com.br/wp-content/uploads/2019/07/lost11_d66z.jpg",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam velit voluptas quidem itaque praesentium at est, voluptatum magnam harum veniam necessitatibus eligendi nihil beatae. Nesciunt quis, saepe eligendi corporis ipsa magnam odit? Iste exercitationem ut commodi assumenda optio, accusamus neque?"
  },
  {
    name: "Condado",
    image: "https://live.staticflickr.com/2831/11657485274_4a5dcc4486_b.jpg",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam velit voluptas quidem itaque praesentium at est, voluptatum magnam harum veniam necessitatibus eligendi nihil beatae. Nesciunt quis, saepe eligendi corporis ipsa magnam odit? Iste exercitationem ut commodi assumenda optio, accusamus neque?"
  }
];

function seedDB() {
  // * Remove all Campgrounds
  Campground.deleteMany({}, err => {
    if (err) {
      console.log(err);
    } else {
      console.log("Removed Campgrounds!");
      // * Add a few campgrounds
      // ! Use inside callback for the correct execution of the code
      data.forEach(seed => {
        Campground.create(seed, (err, campground) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Added: " + campground);

            // * Create a comment on each campground
            Comment.create({ text: "this place is great, but i wish there was internet", author: "homer" }, (err, comment) => {
              if (err) {
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log("Created comment");
              }
            });
          }
        });
      });
    }
  });
}

module.exports = seedDB;
