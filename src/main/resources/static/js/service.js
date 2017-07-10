"use strict";

(function () {
    angular
        .module("hello")
        .factory("AppService", AppService);

    function AppService($http) {

        var api = {
            searchAuthor: searchAuthor,
            searchPaper: searchPaper
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
    }
})();