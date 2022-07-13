const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");

const port = 3000;

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
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

app.get("/articles", (req, res) => {
  Article.find({}, (err, foundArticles) => {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  })
});

app.listen(port, () => {
  console.log("App running on port " + port);
});
