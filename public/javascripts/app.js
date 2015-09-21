var app = angular.module('myApp', []);

app.controller('podcasts', ['$scope', '$http', function($scope, $http){
    $scope.get = function(term) {

        $http.jsonp('https://itunes.apple.com/search', {
            params: {
                "callback": "JSON_CALLBACK",
                "term": term,
                "entity": "podcast"
                }
        }).then(function(response){
            $scope.results = response.data.results;
            console.log(response.data);
        })
    };
    $scope.feed = function(url) {
        var go = {url: url};
        console.log(go);
        $http.post('/xml', go).then(function(response) {
            console.log(response);
            response.data.forEach(function(obj) {
                //console.log(obj.title[0]+' - '+obj.description[0]);
                console.log(obj.title[0] + ' - ' + obj['itunes:duration'] + ' - ' + obj.enclosure[0].$.url + ' - explicit=' + obj['itunes:explicit'][0]);
            })
        })
    };
}]);