var app = angular.module('myApp', ['ngMaterial', 'ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $routeProvider.
        when('/categories', {
            templateUrl: 'views/categories.html',
            controller: 'podcasts'
        }).
        when('/home', {
            templateUrl: 'views/home.html',
            controller: 'podcasts'
        }).
        otherwise({
            redirectTo: '/home'
        });
}]);


app.controller('podcasts', ['$scope', '$http', function($scope, $http){
    $scope.get = function(term) {

        $http.jsonp('https://itunes.apple.com/search', {
            params: {
                "callback": 'JSON_CALLBACK',
                "term": term,
                "entity": 'podcast'
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
                console.log(obj.title[0] + ' - ' + obj['itunes:duration'] + ' - ' + obj.enclosure[0].$.url);
            })
        })
    };
}]);

app.controller('login', ['$scope','$mdDialog', function($scope,$mdDialog){
    $scope.showLogin = function(ev){
        $mdDialog.show({
            controller: DialogController,
            templateUrl: '../views/dialog1.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false
        })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };
    function DialogController($scope, $mdDialog) {
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }
}]);

app.controller('register', ['$scope','$mdDialog', function($scope,$mdDialog){
    $scope.showRegistration = function(ev){
        $mdDialog.show({
            controller: DialogController,
            templateUrl: '../views/dialog2.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false
        })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };
    function DialogController($scope, $mdDialog) {
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }
}]);

app.controller('mplayer', [function(){

}]);

app.controller('home', ['$scope','$http',function($scope, $http){
    $scope.home = (function(some){
        console.log('hello');
        $http.jsonp('https://itunes.apple.com/lookup?id=1024247322', {
            params: {
                "callback": 'JSON_CALLBACK'
            }
        }).then(function(response){
            $scope.results = response.data.results;
            console.log(response);
        })
    });
    $scope.feed = function(url) {
        var go = {url: url};
        console.log(go);
        $http.post('/xml', go).then(function(response) {
            console.log(response);
            response.data.forEach(function(obj) {
                //console.log(obj.title[0]+' - '+obj.description[0]);
                console.log(obj.title[0] + ' - ' + obj['itunes:duration'] + ' - ' + obj.enclosure[0].$.url);
            })
        })
    };
}]);
