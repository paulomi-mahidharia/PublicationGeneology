"use strict";

(function () {
    angular.module('app', ["ng-fusioncharts"])
        .controller('AppController', function ($scope, AppService) {

            //$scope.greeting = {id: 'xxx', content: 'Hello World!'}

            $scope.pageTitle = "Search by Author or Paper title/keyword";
            $scope.infoTableAuthor = false;
            $scope.infoTablePaper = false;

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
                $scope.loading = true;
                $scope.selectedAuthorPapers = [];
                $scope.infoTablePaper = false;
                $scope.infoTableAuthor = false;
                console.log("Now getting papers");

                //Get author papers and conference information
                AppService.searchPapersForAuthor(author.authorId)
                    .then(function (response) {

                        if(response.status == 200){

                            $scope.selectedAuthor = author;
                            $scope.selectedAuthorPapers = response.data;
                            return AppService.searchConferencesForAuthor(author.authorId);
                        }
                    })
                    .then(function (response) {

                        console.log("In Conf");
                        console.log(response);

                        if(response.status == 200) {

                            console.log(response.data);
                            $scope.selectedAuthorConferences = response.data;
                            $scope.loading = false;
                            $scope.infoTableAuthor = true;
                        }
                    });
            };

            $scope.getPaperInfo = function (paper) {

                console.log(paper);
                $scope.loading = true;
                $scope.selectedPaperAuthors = [];
                $scope.infoTablePaper = false;
                $scope.infoTableAuthor = false;
                console.log("Now getting authors");

                // Get authors for paper
                AppService.searchAuthorsForPaper(paper.title)
                    .then(function (response) {
                        $scope.loading = false;
                        $scope.infoTablePaper = true;
                        $scope.selectedPaper = paper;
                        $scope.selectedPaperAuthors = response.data;
                    });
            };

            $scope.myDataSource = {
                chart: {
                    caption: "Harry's SuperMart",
                    subCaption: "Top 5 stores in last month by revenue",
                    numberPrefix: "$",
                    theme: "fint"
                },
                data: [{
                    label: "Bakersfield Central",
                    value: "880000"
                }, {
                    label: "Garden Groove harbour",
                    value: "730000"
                }, {
                    label: "Los Angeles Topanga",
                    value: "590000"
                }, {
                    label: "Compton-Rancho Dom",
                    value: "520000"
                }, {
                    label: "Daly City Serramonte",
                    value: "330000"
                }]
            };
    });
})();