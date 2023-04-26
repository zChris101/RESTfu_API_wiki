const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
var ObjectID = require('mongodb').ObjectID;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', articleSchema);

///////////REQUESTS TARGETTING ALL ARTICLES////////////////////////////////

app.route('/articles')
    .get(async (req, res) => {
        await Article.find({})
            .then((foundArticle, err) => {
                if (!err) {
                    res.send(foundArticle);
                } else {
                    res.send(err);
                }

            });
    })

    .post(async (req, res) => {
        console.log(req.body.title);
        console.log(req.body.content);

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })

        newArticle.save()
            .then((success, err) => {
                if (success) {
                    res.send('Success sending it to the db')
                } else {
                    res.send(err);
                }
            });

    })

    .delete(async (req, res) => {
        await Article.deleteMany()
            .then((success, err) => {
                if (success) {
                    console.log('Success in deleting documents')
                } else {
                    console.log(err);
                }
            })

    });

///////////REQUESTS TARGETTING A SPECIFIC ARTICLES////////////////////////////////

app.route('/articles/:articleTitle')

    .get(async (req, res) => {
        await Article.findOne({ title: req.params.articleTitle })
            .then((foundArticle, err) => {
                if (foundArticle) {
                    res.send(foundArticle);
                } else {
                    res.send(err);
                }
            })


    })

    .put(async (req, res) =>{

       await Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body},
            {new : true})

            .then((success,err)=>{
                if (success){
                    res.send('Success in updating');
                } else {
                    res.send(err);
                }
            });

            
    })

    .patch(async (req, res) =>{

        await Article.updateOne(
             {title: req.params.articleTitle},
             {title: req.body.title, content: req.body.content},
             {new : true})
 
             .then((success,err)=>{
                 if (success){
                     res.send('Success in updating');
                 } else {
                     res.send(err);
                 }
             });
 
             
     })

     .delete(async (req,res)=>{
        await Article.deleteOne({
            title: req.params.articleTitle
        })
        .then((success,err)=>{
            if (success){
                res.send('Succeed in deleting');
            } else {
                res.send(err);
            }
        });
     });


app.listen(3000, () => {
    console.log('Server started on port 3000');
});