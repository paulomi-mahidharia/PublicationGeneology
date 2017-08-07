"use strict";

(function () {
    //'ng-fusioncharts', 'chart.js',
    angular.module('app', ['nvd3', 'ng-fusioncharts'])
        .controller('AppController', function ($scope, AppService) {

            //$scope.greeting = {id: 'xxx', content: 'Hello World!'}

            $scope.pageTitle = "Search by Author or Paper title/keyword";
            $scope.infoTableAuthor = false;
            $scope.infoTablePaper = false;

            console.log($scope.result);

            $scope.searchPublication = function () {

                var selection = $scope.result;

                if (selection === 'author') {

                    var authorName = $scope.authorName;

                    AppService.searchAuthor(authorName)
                        .then(function (response) {
                            console.log(response.data);

                            $scope.authors = response.data;
                            $scope.predicate = 'author';
                        });
                }

                if (selection === 'paper') {

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
                $scope.showChats = false;
                $scope.selectedAuthorPapers = [];
                $scope.infoTablePaper = false;
                $scope.infoTableAuthor = false;
                console.log("Now getting papers");

                //Get author papers and conference information
                AppService.searchPapersForAuthor(author.authorId)
                    .then(function (response) {

                        if (response.status == 200) {

                            $scope.selectedAuthor = author;
                            $scope.selectedAuthorPapers = response.data;
                            return AppService.searchConferencesForAuthor(author.authorId);
                        }
                    })
                    .then(function (response) {

                        console.log("In Conf");
                        console.log(response);

                        if (response.status == 200) {

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
                $scope.showChats = false;
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

                        console.log("Looking for co-authors");
                        
                        var nodes = [];
                        var group = 0;

                        angular.forEach($scope.selectedPaperAuthors, function (author) {
                            nodes.push({"name":author,"group":group});
                        });

                        console.log(nodes);
                    });
            };


            $scope.welcome = "Hello";
            $scope.showChats = false;

            $scope.myDataSource = {};
            $scope.showPaperGraph = function () {

                console.log("showing graph");
                $scope.showChats = true;
                $scope.infoTableAuthor = false;
                $scope.infoTablePaper = false;

                $scope.chartDataConf = [];

                angular.forEach($scope.selectedAuthorPapers, function (paper) {

                    if ($scope.chartDataConf.indexOf(paper.confName) == -1) {
                        $scope.chartDataConf.push(paper.confName);
                    }
                });

                var myData = [];
                angular.forEach($scope.chartDataConf, function (conf) {

                    var count = 0;
                    angular.forEach($scope.selectedAuthorPapers, function (paper) {

                        if (paper.confName === conf) {
                            count = count + 1;
                        }
                    });

                    var obj = {
                        label: conf,
                        value: count
                    };

                    myData.push(obj)
                });

                $scope.myDataSource = {
                    chart: {
                        caption: "Number of papers published in conferences",
                        startingangle: "120",
                        showlabels: "0",
                        showlegend: "1",
                        enablemultislicing: "0",
                        slicingdistance: "15",
                        showpercentvalues: "1",
                        showpercentintooltip: "0",
                        plottooltext: "Published $datavalue papers in conference $label",
                        theme: "fint"
                    },
                    data: myData
                };
            };
        });
})();