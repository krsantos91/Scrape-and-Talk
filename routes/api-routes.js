var db = require('../models')
var axios = require('axios')
var cheerio = require('cheerio')

module.exports = function(app){

  app.get("/",function(req,res){
    db.Article.find({},function(err,found){
      if (err){
        res.send("ERROR")
      } else{
        var returnData = {
          entry : found
        }
        res.render("index", returnData)
      }
    })
  })

  app.post("/articles/:id", function(req,res){
    db.Comment
      .create(req.body)
      .then(dbComment=>{
        return db.Article.update({ _id: req.params.id },{$push: {comments: {comment: dbComment._id}}}, {new:true})
      })
      .then(returnData=>{
        db.Article
        .findOne({_id:req.params.id})
        .populate("comments.comment")
        .then(dbArticle=>{
          res.json(dbArticle)
        })
      })
      .catch(err=>{
        res.json(err)
      })
  })

  // app.delete("deletecomment",function(req,res){
  //   db.Comment
  //   .findOneAndRemove({_id:req.body.commentid})
  //   .then(dbComment=>{
  //     return db.Article.update({ _id: req.body.articleid },{$pull: {comments: {comment: req.body.commentid}}}, {new:true})
  //   }).then(returnData=>{
  //     res.json(returnData)
  //   }).catch(err=>{
  //     console.log(err)
  //   })
  // })

  app.get("/articles/:id",function(req,res){
    db.Article
    .findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("comments.comment")
    .then(dbArticle=> {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(err=> {
      // If an error occurred, send it to the client
      res.json(err);
    });

  })

  app.get("/scrape", function(req,res){
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
        .count({link:result.link},(err,count)=>{
          if(!count){
            db.Article
            .create(result)
            .then(dbArticle=>{
              console.log("Article added to mongoDB")
              console.log(i)
            })
          }else{
            console.log("Article already exists in mongoDB")
            console.log(i)
          }
        })
      });
      res.redirect('/')
    });  
  })


}