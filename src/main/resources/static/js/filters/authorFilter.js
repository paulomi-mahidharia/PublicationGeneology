"use strict";

(function () {
    angular.module('app')
        .filter('author', function () {

            return function (authors, author) {

                var newAuthors = [];
                angular.forEach(authors, function (localAuthor) {

                    if (localAuthor.authorId !== author) {
                        newAuthors.push(localAuthor)
                    }
                });

                return newAuthors;
            };
        })
})();