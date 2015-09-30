var mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router(),
    Genre = require('../models/genres');

router.get('/:genre', function(req, res, next){
    var type = req.params.genre;
    console.log(req.params);

    Genre.find({genre: type}, function(err, podcasts){
        console.log(podcasts);
        res.json(podcasts);
    });
});

//router.post('/', function(req,res,next){
//
//var genre = new Genre({
//    title: req.body.title,
//    genre: req.body.genre,
//    index: req.body.index
//});
//
//    genre.save(function(err){
//        if(err){
//            throw err
//        }
//    });
//    res.sendStatus(200);
//});

module.exports = router;