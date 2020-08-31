const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require("ejs");

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const wikiSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Article = mongoose.model("Article", wikiSchema);

// "/articles" route
app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, articles) {
      if (err) {
        console.log(err);
      } else {
        res.send(articles)
      }
    })
  })

  .post(function(req, res) {
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    })
    article.save();
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.send("deleted");
      }
    })
  })
;

app.route('/articles/:articlename')
  .get(function(req,res) {
    var articlename=req.params.articlename;
    Article.find({title:articlename},function(err,article) {
      if (err) {
        res.send(err)
      }else {
        res.send(article)
      }
    })
  })
  .put(function(req,res) {
    var articlename=req.params.articlename;
    Article.updateOne({title:articlename},{content:req.body.content,title:req.body.title},{overwrite:true},function(err) {
      if (err) {
        console.log(err);
      }else {
        res.send("updated")
      }
    })
  })
  .patch(function(req,res) {
    var articlename=req.params.articlename;
    Article.updateOne({title:articlename},{$set :req.body},function(err) {
      if (err) {
        console.log(err);
      }else {
        res.send("updated")
      }
    });
  })
  .delete(function(req,res) {
    var articlename=req.params.articlename;
    Article.deleteOne({title:articlename},function(err) {
      if (err) {
        console.log(err);
      }else {
        res.send("deleted")
      }
    });
  })
;



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
