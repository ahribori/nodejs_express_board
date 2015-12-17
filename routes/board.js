/**
 * Created by Daniel on 2015-12-17.
 */

var express = require('express');
var router = express.Router();

///////////////////////////////////////////////////////////////////
// get mongoose package
var mongoose = require('mongoose');

// connect to MongoDB / the name of DB is set to 'test'
mongoose.connect('mongodb://localhost:27017/test');

// we get the pending connection to myDB running on localhost
var db = mongoose.connection;

// we get notified if error occurs
db.on('error', console.error.bind(console, 'connection error:'));

// executed when the connection opens
db.once('open', function callback () {
    // add your code here when opening
    console.log("MongoDB Connection Open");
});

// creates DB schema
var articleSchema = mongoose.Schema({
    writer: 'string',
    title: 'string',
    contents: 'string',
    hits: 'number',
    date: 'string'
});

// compiels our schema into a model
var Article = mongoose.model('article', articleSchema);
///////////////////////////////////////////////////////////////////



/* GET users listing. */
router.get('/', function(req, res, next) {

    var articles = {};
    Article.find({},function(err, articles) {
        if (err) return console.error(err);
        this.articles = articles;
        console.log(JSON.stringify(articles));
    })

//TODO JSON 문법 공부 다시하자
    res.render('board_list', {
        title: 'Node.js Express + MongoDB Board',
        articles : JSON.stringify(articles)
    });
});

router.get('/:id', function(req, res, next) {
    res.send('article', { id: req.params.id, writer: "The Writer", title: "Title", contents: "Contents", date: new Date() });
});

router.post('/write', function(req, res, next) {
    var writer = req.param("writer");
    var title = req.param("title");
    var contents = req.param("contents");
    var hits = 0;
    var date = new Date();

    var article = new Article({
        writer: writer,
        title: title,
        contents: contents,
        hits: hits,
        date: date
    })

    article.save(function(err, article) {
        if(err) {
            console.log(err);
        }
    })

    res.render('commit_result', { writer: writer, title: title, contents: contents });

});

module.exports = router;