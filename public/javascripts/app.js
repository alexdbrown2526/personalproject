var app = angular.module('myApp', ['ngMaterial', 'ngRoute']);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
//Sets up my application routes
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $routeProvider.
        when('/categories', {
            templateUrl: 'views/categories.html'
        }).
        when('/home', {
            templateUrl: 'views/home.html'
        }).
        when('/episode', {
            templateUrl: 'views/episodes.html'
        }).
        when('/results', {
            templateUrl: 'views/searchResults.html'
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
            });
    };
    function DialogController($scope, $mdDialog) {
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
            });
    };
    function DialogController($scope, $mdDialog) {
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            console.log(answer);
            $mdDialog.hide(answer);
        };
    }
}]);
//API call for search by podcast term from search bar
app.controller('podcasts', ['$scope', '$location', '$http','searchFactory','episodeFactory', 'playlistFactory', 'musicFactory', function($scope, $location, $http, searchFactory, episodeFactory, playlistFactory, musicFactory){
    var term = searchFactory.getData();
    $scope.text = term;
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
    };
    $scope.$on('playlist', function(){
    var episodes = playlistFactory.getData();
    console.log(episodes);
    $scope.episode = episodes;
    });
    $scope.play = function(url){
        console.log(url);
       musicFactory.sendData(url)
    };
    $scope.delete = function(episode){
        console.log('hello');
        var id = '560ece316d4645e054bc8a33';
        var track = episode;
        $http.put('/users', { id:id, track: track }).then(function() {
            $http.get('/users/'+id).then(function (response) {
                console.log(response);
                playlistFactory.sendData(response.data.playlist);
            })
        })
    }
}]);
//API call for podcasts by genre for category page
app.controller('categories', ['$scope', '$http', '$location', 'episodeFactory', function($scope, $http, $location, episodeFactory){
    $scope.categories = [
        'Art', 'Comedy', 'Education', 'Kids & Family',
        'Health', 'TV & Film', 'Music', 'News & Politics',
        'Religion & Spirituality', 'Science & Medicine',
        'Sports & Recreation', 'Technology', 'Business',
        'Games & Hobbies', 'Society & Culture', 'Government & Organizations'
    ];
    $scope.subs = function(value){
        $http.get('/genres/'+value
        ).then(function(response){
        $scope.subGenres = response.data
        })
    };
    $scope.subcast = function(value){
        $http.post('/xmlCat', {genre: value}).then(function(response) {
            $scope.subDisps = response.data;
        })
    };
    $scope.subEps = function(id){
        $http.jsonp('https://itunes.apple.com/lookup?id='+id, {
            params: {
                "callback": 'JSON_CALLBACK'
            }
        }).then(function(response){
            $scope.results = response.data.results;
            $scope.feed($scope.results[0].feedUrl, response.data.results[0]);
        })
    };
    $scope.feed = function(url, result) {
        var go = {url: url};
        $http.post('/xml', go).then(function(response) {
            var podcasts = response.data;
            episodeFactory.sendData(podcasts,result);
            $location.url('/episode');
        })
    }
}]);
//home page controller
app.controller('home', ['$scope', '$http', '$location', 'episodeFactory', function($scope, $http,$location, episodeFactory){
    function getHome() {
        $http.post('/xmlHome', {}).then(function (response) {
            $scope.homeDisps = response.data;
        });
    }
        $scope.homeEps = function(id){
            $http.jsonp('https://itunes.apple.com/lookup?id='+id, {
                params: {
                    "callback": 'JSON_CALLBACK'
                }
            }).then(function(response){
                $scope.results = response.data.results;
                $scope.feed($scope.results[0].feedUrl, response.data.results[0]);
            })
        };
        $scope.feed = function(url, result) {
            var go = {url: url};
            $http.post('/xml', go).then(function(response) {
                var podcasts = response.data;
                episodeFactory.sendData(podcasts,result);
                $location.url('/episode');
            })
        };
    getHome();
}]);
//search bar controller
app.controller('search', ['$scope','$location', 'searchFactory', function($scope, $location, searchFactory) {
    $scope.doit = function (text) {
        $location.url('/results');
        searchFactory.sendData(text);
    }
}]);
//episode controller
app.controller('episode', ['$scope','$http','episodeFactory', 'musicFactory', 'playlistFactory', function($scope, $http, episodeFactory, musicFactory, playlistFactory){
    var episode = episodeFactory.getData();
    $scope.indeps = episode[0];
    $scope.show = episode[1];
    console.log($scope.show);
    $scope.playIt = function(track) {
        musicFactory.sendData(track);
    };
    $scope.playlist = function(episode, show){
        console.log(episode);
        console.log(show);
        var playEp = {podTitle: show.collectionName, epTitle: episode.title[0], epUrl: episode.enclosure[0].$.url, epDur: episode['itunes:duration'][0], epDate: episode.pubDate[0], podImage: show.artworkUrl60};
        $http.put('/playlist', playEp).then(function(response){
            console.log(response);
            $scope.get();
        })
    };
    $scope.get = function(){
        var id = '560ece316d4645e054bc8a33';
      $http.get('/users/'+id).then(function(response){
          console.log(response);
          playlistFactory.sendData(response.data.playlist);
      })
    };
}]);
//audio player controller
app.controller('audioPlayer', ['$scope','$sce', 'musicFactory', function($scope, $sce, musicFactory){

    $scope.$on('shared', function(){
        var foo = [];
        var playTrack = musicFactory.getData();
        console.log('hello2');
        foo.push({ url: $sce.trustAsResourceUrl(playTrack)});
        $scope.foo = foo;
    });
}]);
//music data share factory
app.factory('musicFactory',['$rootScope', function($rootScope){
    var service = {};
    service.data = false;
    service.sendData = function(data){
        this.data = data;
        $rootScope.$broadcast('shared');
    };
    service.getData = function(){
        console.log('hello1');
        return this.data;
    };
    return service
}]);
//search data share factory
app.factory('searchFactory',['$rootScope', function($rootScope){
    var service = {};
    service.data = false;
    service.sendData = function(data){
        console.log('hello');
        this.data = data;
        $rootScope.$broadcast('share');
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
//playlist object constructing factory
app.factory('playlistFactory', ['$rootScope', function($rootScope){
    var service = {};
    service.data = false;
    service.sendData = function(playlist){
        console.log(playlist);
        this.playlist = playlist;
        $rootScope.$broadcast('playlist');
    };
    service.getData = function(){
        return this.playlist;
    };
    return service;
}]);
