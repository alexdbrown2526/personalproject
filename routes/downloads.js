var express = require('express');
var router = express.Router();
var Download = require('download');
var path = require('path');


router.post('/', function(req, res, next){
    var url = req.body.url;

    new Download({mode: '755'})
        .get(url);
        console.log(url)
        .dest()
        .run();
    res.sendStatus(200);
});
module.exports = router;