var db = require('../models')

module.exports = function(app){
  app.get("/comment",function(err,res){
    db.Comment.find({},function(err,found){
      res.json(found)
    })
  })

  app.get("/articles",function(req,res){
    db.Article.find({},function(err,found){
      res.json(found)
    })
  })

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
}