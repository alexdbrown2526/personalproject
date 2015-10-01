var app = angular.module('myApp', ['ngMaterial', 'ngRoute']);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
//Sets up my application routes
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $routeProvider.
        when('/categories', {
            templateUrl: 'views/categories.html',
            controller: 'categories'
        }).
        when('/home', {
            templateUrl: 'views/home.html',
            controller: 'home'
        }).
        when('/episode', {
            templateUrl: 'views/episodes.html',
            controller: 'podcasts'
        }).
        when('/results', {
            templateUrl: 'views/searchResults.html',
            controller: 'podcasts'
        }).
        otherwise({
            redirectTo: '/home'
        });
}]);
//Dialog for my login page
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
//Dialog for my registration
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
//API call to get usable data from ID that is returned in home page RSS feed
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
            $scope.episodes = response.data
        })
    };
}]);
//API call for search by podcast term from search bar
app.controller('podcasts', ['$scope', '$location', '$http','searchFactory','episodeFactory', function($scope, $location, $http, searchFactory, episodeFactory){
    var text = searchFactory.getData();
    $scope.text = text;
    $http.jsonp('https://itunes.apple.com/search', {
        params: {
            "callback": 'JSON_CALLBACK',
            "term": $scope.text,
            "entity": 'podcast'
        }
    }).then(function (response) {
        $scope.results = response.data.results;
    });
    $scope.feed = function(url, result) {
        var go = {url: url};
        $http.post('/xml', go).then(function(response) {
            var podcasts = response.data;
            episodeFactory.sendData(podcasts,result);
            $location.url('/episode');
        })
    }
}]);
//API call for podcasts by genre for category page
app.controller('categories', ['$scope', '$http', function($scope, $http){
    $scope.categories = [
        'Art', 'Comedy', 'Education', 'Kids & Family',
        'Health', 'TV & Film', 'Music', 'News & Politics',
        'Religion & Spirituality', 'Science & Medicine',
        'Sports & Recreation', 'Technology', 'Business',
        'Games & Hobbies', 'Society & Culture', 'Government & Organizations'
    ];
    $scope.subs = function(value){
        console.log(value);
        $http.get('/genres/'+value
        ).then(function(response){
        $scope.subGenres = response.data
        })
    };
    $scope.subcast = function(value){
        console.log(value);
        $http.post('/xmlCat', {genre: value}).then(function(response) {
            $scope.subDisps = response.data;
            console.log(response.data);
        })
    };
    $scope.subEps = function(id){
        console.log('hello', id);
        $http.jsonp('https://itunes.apple.com/lookup?id='+id, {
            params: {
                "callback": 'JSON_CALLBACK'
            }
        }).then(function(response){
            $scope.results = response.data.results;
            console.log(response);
        })
    }
}]);
//home page controller
app.controller('home', ['$scope', '$http', function($scope, $http){
    angular.element(document).ready(function() {
        $http.post('/xmlHome',{}).then(function(response){
            $scope.homeDisps = response.data;
        })
    })
}]);
//search bar controller
app.controller('search', ['$scope','$location', 'searchFactory', function($scope, $location, searchFactory) {
    $scope.doit = function (text) {
        $location.url('/results');
        searchFactory.sendData(text);
    }
}]);
//episode controller
app.controller('episode', ['$scope','episodeFactory', 'musicFactory', function($scope, episodeFactory, musicFactory){
    var episode = episodeFactory.getData();
    $scope.indeps = episode[0];
    $scope.show = episode[1];
    $scope.playIt = function(track){
        musicFactory.sendData(track);
    }
}]);
//audio player controller
app.controller('audioPlayer', ['$scope','$sce', 'musicFactory', function($scope, $sce, musicFactory){

    $scope.$on('shared', function(){
        var foo = [];
        var playTrack = musicFactory.getData();
        foo.push({ url: $sce.trustAsResourceUrl(playTrack)});
        $scope.foo = foo;
    });

}]);
//music data share factory
app.factory('musicFactory', function($rootScope){
    var service = {};
    service.sendData = function(data){
        this.data = data;
        $rootScope.$broadcast('shared');
    };
    service.getData = function(){
        return this.data;
    };
    return service
});
//search data share factory
app.factory('searchFactory',['$rootScope', function($rootScope){
    var service = {};
    service.data = false;
    service.sendData = function(data){
        this.data = data;
        $rootScope.$broadcast('sharing');
    };
    service.getData = function(){
        return this.data;
    };
    return service;
}]);
//episode data share factory
app.factory('episodeFactory',['$rootScope', function($rootScope){
    var service = {};
    service.data = false;
    service.sendData = function(data,result){
        this.data = data;
        this.result = result;
        $rootScope.$broadcast('sharing');
    };
    service.getData = function(){
        return [this.data, this.result];
    };
    return service;
}]);

