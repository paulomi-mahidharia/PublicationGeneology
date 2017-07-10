angular.module('hello', [])
    .controller('home', function ($scope, AppService) {

        //$scope.greeting = {id: 'xxx', content: 'Hello World!'}

        $scope.pageTitle = "Search by Author or Paper title/keyword";

        console.log($scope.result);

        $scope.searchPublication = function() {

            var selection = $scope.result;

            if(selection === 'author') {

                var authorName = $scope.authorName;

                AppService.searchAuthor(authorName)
                    .then(function (response) {
                       console.log(response.data);

                        $scope.authors = response.data;
                        $scope.predicate = 'author';
                    });
            }

            if(selection === 'paper') {

                var paperName = $scope.paperName;
                console.log(paperName);

                AppService.searchPaper(paperName)
                    .then(function (response) {
                        console.log(response.data);

                        $scope.papers = response.data;
                        $scope.predicate = 'paper';
                    });
            }
        };
        
        $scope.getAuthorInfo = function (author) {

            console.log(author);

            //Get author papers and conference information
        }

        $scope.getPaperInfo = function (paper) {

            console.log(paper);

            //Get author papers and conference information
        }
    });