var mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router(),
    User = require('../models/users');

router.post('/', function(req,res,next){
  var user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    playlist: []
  });
  user.save(function(err){
    if(err){
      throw(err);
    }
  });
  res.sendStatus(200);
});

module.exports = router;
