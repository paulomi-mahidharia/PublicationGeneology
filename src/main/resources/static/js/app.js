"use strict";

(function () {
    angular.module('app', ['ng-fusioncharts', 'chart.js'])
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
                    });
            };


            $scope.welcome = "Hello";
            $scope.showChats = false;

            // $scope.myDataSource = {
            //     chart: {
            //         caption: "Publication Timeline",
            //         subCaption: "Top 5 stores in last month by revenue",
            //     },
            //     data:[{
            //         label: "Bakersfield Central",
            //         value: "880000"
            //     },
            //         {
            //             label: "Garden Groove harbour",
            //             value: "730000"
            //         },
            //         {
            //             label: "Los Angeles Topanga",
            //             value: "590000"
            //         },
            //         {
            //             label: "Compton-Rancho Dom",
            //             value: "520000"
            //         },
            //         {
            //             label: "Daly City Serramonte",
            //             value: "330000"
            //         }]
            // };


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


                // $scope.labels = [];
                //
                // angular.forEach($scope.selectedAuthorPapers, function (paper) {
                //
                //     // if($scope.labels.indexOf(paper.year) == -1) {
                //     //     $scope.labels.push(paper.year);
                //     // }
                // })

            };

            //$scope.labels =["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"];

            // $scope.data = [
            //     [65, 59, 90, 81, 56, 55, 40],
            //     [28, 48, 40, 19, 96, 27, 100]
            // ];
        });
})();