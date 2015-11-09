var request = require('request'),
    express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    xml2js = require('xml2js');

router.post('/', function(req, res, next){
    var genre = req.body.genre;
    var file = 'https://itunes.apple.com/us/rss/toppodcasts/limit=25/genre='+genre+'/explicit=true/xml';
    console.log(genre, file);
    request(file, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            var parseString = require('xml2js').parseString;
            var xml = body;
            parseString(xml, function (err, result) {
                console.log(result.feed.entry);
                res.send(result.feed.entry);
            });

        }

    });

});

module.exports = router;