var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var request = require("request")


// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var cheerio = require("cheerio");
var axios = require("axios");

// Require all models
var db = require("./models");

// Establish port
var PORT = 3000;

// Initialize Express
var app = express();

//////////////////////////
// Configure middleware //
//////////////////////////

// Use Express-handlebars for front end
var exphbs = require("express-handlebars");
app.set("views", "./views")
app.engine("handlebars", exphbs({ 
  extname: ".handlebars"
}));
app.set("view engine","handlebars");

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scrapeAndTalk", {
  useMongoClient: true
});

// Scrape website to grab data to render to the page
axios.get("http://www.theringer.com/nba").then(function(response) {
  // Then, we load that into cheerio and save it to $ for a shorthand selector
  var $ = cheerio.load(response.data);

  // Now, we grab every article with this class, and do the following:
  $("[class=c-entry-box--compact__title]").each(function(i, element) {
    // Save an empty result object
    var result = {};

    // Add the text and href of every link, and save them as properties of the result object
    result.title = $(this)
      .children("a")
      .text();
    result.link = $(this)
      .children("a")
      .attr("href");
    result.summary = $(this)
      .parent()
      .children("p")
      .text()


    // Create a new Article using the `result` object built from scraping
    db.Article
    .create(result)
    .then(dbArticle=>{
      console.log("Article added to MongoDB");
      console.log(i);
    });
  });
});   

require("./routes/api-routes.js")(app);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
