const express = require('express')
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static('public'));
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = {
    title: String,
    content: String
}
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
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.json({
                    "message": "Sucessfully added a new article"
                });
            } else {
                res.json({
                    "message": "error"
                });
            }
        });
    })
    .delete((req, res) => {

        Article.deleteMany(function (err) {
            if (!err) {
                res.json({
                    "message": "Successfully deleted all articles"
                })
            } else {
                res.json({
                    "message": "delete operation could not be performed"
                });
            }
        })
    });
app.route("/articles/:articleTitle")
    .get((req, res) => {

        Article.findOne({
            title: req.params.articleTitle
        }, function (err, foundArticle) {

            if (!err) {
                res.send(foundArticle);
            } else {
                res.send({
                    "message": "not found"
                })
            }
        })
    })
    .put(function (req, res) {

        Article.updateOne({
                title: req.params.articleTitle
            }, {
                title: req.body.title,
                content: req.body.content
            },

            function (err) {
                if (!err) {
                    res.json({
                        "message": "Successfully updated"
                    })
                }
                if (err) {
                    //res.json({"message":"could not update"})
                    res.json({
                        "message": "cannot be updated"
                    })

                }
            }
        )
    })
    .patch(function (req, res) {

        Article.updateOne({
                title: req.params.articleTitle
            }, {
                $set: req.body
            },
            function (err) {
                if (err) {
                    res.json({
                        "message": "cannot be updated"
                    })
                } else {
                    res.json({
                        "message": "successfully updated"
                    })
                }
            }
        )
    })
    .delete(function (req, res) {

        Article.deleteOne({
                title: req.params.articleTitle
            },
            function (err) {
                if (!err) {
                    res.json({
                        "message": "Successfully deleted"
                    })
                } else {
                    res.json({
                        "message": "error"
                    })
                }
            }
        )
    })

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})