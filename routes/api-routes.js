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
      .then(newComment=>{
        return db.Article.update({ _id: req.params.id },{ $push: {comment: newComment._id}})
      })
      .then(returnData=>{
        res.json(newComment)
      })
      .catch(err=>{
        res.json(err)
      })
  })

  app.get("/articles/:id",function(req,res){
    var id =req.params.id
    console.log(id)
    db.Article
    .findOne({
      _id: id
    })
    .populate("comment")
    .then(ArticleComment=>{
      res.send(ArticleComment)
    })

  })
}