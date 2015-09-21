var FeedParser = require('feedparser'),
    request = require('request'),
    express = require('express'),
    router = express.Router(),
    bodyParser = require('body-Parser'),
    xml2js = require('xml2js');

router.post('/', function(req, res, next){
url = req.body.url;

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            var parseString = require('xml2js').parseString;
            var xml = body;
            parseString(xml, function (err, result) {
                res.send(result.rss.channel[0].item);
                });

        }

    });

});

module.exports = router;