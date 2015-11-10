var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/users');
router.put('/', function(req,res,next){
    var podcast = req.body;
    console.log(podcast);

    User.findById({_id: '564161a164f7be400d9ab2e0'}, function(err, user){
        user.update( {$push: {playlist: podcast}}, function(err, response){
            res.json(response);
        });
    });

});

module.exports = router;