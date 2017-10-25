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
var PORT = process.env.PORT || 8080;

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
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

// Connect to API routes
require("./routes/api-routes.js")(app);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
