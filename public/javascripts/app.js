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
            console.log(response.data)
        })
    }
}]);