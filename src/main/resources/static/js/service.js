"use strict";

(function () {
    angular
        .module("app")
        .factory("AppService", AppService);

    function AppService($http) {

        var api = {
            searchAuthor: searchAuthor,
            searchPaper: searchPaper,
            searchAuthorsForPaper: searchAuthorsForPaper,
            searchPapersForAuthor: searchPapersForAuthor,
            searchConferencesForAuthor: searchConferencesForAuthor
        };

        return api;
        
        function searchAuthor(authorName) {

            var data = $.param({
                authorName: authorName
            });

            var config = {
                headers: {
                    'Accept' : '*/*',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            };

            return $http.post("./../search/author/", data, config);
        }

        function searchPaper(paperName) {

            var data = $.param({
                keyword: paperName
            });

            var config = {
                headers: {
                    'Accept' : '*/*',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            };

            return $http.post("./../search/paper/", data, config);
        }
        
        function searchAuthorsForPaper(title) {

            var data = $.param({
                title: title
            });

            var config = {
                headers: {
                    'Accept' : '*/*',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            };

            return $http.post("./../search/paper/authors", data, config);
        }
        
        function searchPapersForAuthor(authorId) {

            console.log("Finding author for id : "+authorId);

            var config = {
                headers: {
                    'Accept' : '*/*',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            };

            return $http.get("./../search/author/"+authorId+"/papers", config);
        }

        function searchConferencesForAuthor(authorId) {

            console.log("Finding author for id : "+authorId);

            var config = {
                headers: {
                    'Accept' : '*/*',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            };

            return $http.get("./../search/author/"+authorId+"/conferences", config);
        }
    }
})();