var mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router(),
    User = require('../models/users');

//router.post('/', function(req,res,next){
//  var user = new User({
//    firstName: req.body.firstName,
//    lastName: req.body.lastName,
//    email: req.body.email,
//    username: req.body.username,
//    password: req.body.password,
//    playlist: []
//  });
//  user.save(function(err){
//    if(err){
//      throw(err);
//    }
//  });
//  res.sendStatus(200);
//});
router.get('/:id', function(req, res, next){
  console.log(req.params.id);
  User.findOne({_id: req.params.id}, function(err, user){
    console.log(user);
    res.json(user);
  })
});
router.put('/', function(req, res, next){
console.log(req.body);

User.update({_id: req.body.id },
    { $pull: { "playlist": { "epTitle":  req.body.track  } } }, function(err, response) {
      console.log(response);
        res.json(response);
    })
});
module.exports = router;
