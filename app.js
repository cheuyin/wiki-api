const mongoose = require("mongoose");
const express = require("express");

const port = 3000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', "ejs");
app.use(express.static("public"));

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/wikiDB');
}

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
})
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
  .get((req, res) => {
    Article.find({}, (err, foundArticles) => {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    })
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.query.title,
      content: req.query.content
    });
    newArticle.save((err) => {
      if (!err) {
        res.send("Successfully added a new article");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    })
  });

app.route("/articles/:article")
  .get((req, res) => {
    Article.findOne({title: req.params.article}, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No article with that title was found");
      }
    })
  })
  .put((req, res) => {
    Article.findOneAndUpdate(
      {title: req.params.article},
      {title: req.query.title, content: req.query.content},
      {overwrite: true, new: true},
      (err, doc) => {
        if (err) {
          res.send(err);
        } else {
          res.send(doc);
        }
      }
    )
  })
  .patch((req, res) => {
    Article.findOneAndUpdate(
      {title: req.params.article},
      {title: req.query.title, content: req.query.content},
      {new: true},
      (err, doc) => {
        if (err) {
          res.send(err);
        } else {
          res.send(doc);
        }
      }
    )
  })

app.listen(port, () => {
  console.log("App running on port " + port);
});
