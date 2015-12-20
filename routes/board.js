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

    var data = {};

    Article.find({}).
    sort( {"_id" : -1}).
    limit(10).
    exec(function(err, articles) {
        if (err) return console.error(err);
        data = articles;

        //console.log(data);
        res.render('board_list', {
            title: 'Node.js Express + MongoDB Board',
            articles: data
        });
    })

});

router.get('/:id', function(req, res, next) {

   Article.find({"_id": req.params.id},function(err, articles) {
        if (articles != null) {
            console.log(articles)

            Article.update({"_id": articles[0]._id}, {hits: 1}, function(err){
                if (err) console.log(err);
                console.log('uphits');
            })

            res.render('article', {
                data: articles
            });
        } else {
            callback();
        }
    })
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

    res.redirect('/board');

});

module.exports = router;