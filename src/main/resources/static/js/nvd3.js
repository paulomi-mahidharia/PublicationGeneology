"use strict";

(function () {
    angular.module('app', ['nvd3', 'ng-fusioncharts'])
        .controller('Nvd3Controller', function ($scope, $filter, AppService) {

            $scope.pageTitle = "Search by Author or Paper title/keyword";
            $scope.infoTableAuthor = false;
            $scope.infoTablePaper = false;
            $scope.showAuthorChats = false;
            $scope.foundCoAuthors = true;

            console.log($scope.result);

            $scope.searchPublication = function () {

                $scope.loadingSpinnerForTable = true;

                var selection = $scope.result;

                if (selection === 'author') {

                    var authorName = $scope.authorName;

                    AppService.searchAuthor(authorName)
                        .then(function (response) {
                            console.log(response.data);

                            $scope.loadingSpinnerForTable = false;
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

                            $scope.loadingSpinnerForTable = false;
                            $scope.papers = response.data;
                            $scope.predicate = 'paper';
                        });
                }
            };

            $scope.getAuthorInfo = function (author) {

                console.log(author);
                $scope.loading = true;
                $scope.showChats = false;
                $scope.showAuthorChats = false;
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

            var nodes = [];
            var links = [];
            var group = 0;
            var nameIntMap = [];
            var int = 0;
            var coAuthorInfo = [];

            $scope.getPaperInfo = function (paper) {

                console.log(paper);
                $scope.loading = true;
                $scope.showChats = false;
                $scope.showAuthorChats = false;
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

                        var authors = $scope.selectedPaperAuthors;

                        console.log("Looking for co-authors");


                        // Push current authors
                        angular.forEach(authors, function (author) {
                            nodes.push({"name": author.name, "group": group});
                            nameIntMap.push({"name": author.name, "int": int});
                            int = int + 1;
                        });
                        console.log(nodes);

                        console.log("------");
                        // Link Current authors
                        angular.forEach(authors, function (author) {

                            var currentAuthor = $filter('filter')(nameIntMap, {name: author.name}, true)[0];
                            var otherAuthors = authorFilter(authors, author.authorId);

                            angular.forEach(otherAuthors, function (otherAuthor) {
                                var foundItem = $filter('filter')(nameIntMap, {name: otherAuthor.name}, true)[0];
                                links.push({"source": currentAuthor.int, "target": foundItem.int, "value": 1});
                            });
                        });

                        console.log(links);

                        angular.forEach($scope.selectedPaperAuthors, function (author) {

                            AppService.getCoAuthors(author.authorId, paper.paperId, paper.year)
                                .then(function (response) {
                                    coAuthorInfo.push({author: author, coAuthors: response.data});
                                    console.log("Done");
                                    $scope.foundCoAuthors = false;
                                });
                        });

                    });
            };

            $scope.showAuthorGraph = function () {

                console.log("PRINTING ");
                console.log(coAuthorInfo);

                // Pushing to nodes
                angular.forEach(coAuthorInfo, function (author) {
                    angular.forEach(author.coAuthors, function (paper) {

                        group = group + 1;
                        console.log(paper.paperId + " " + group);
                        angular.forEach(paper.authors, function (coAuthor) {
                            //int = int + 1;
                            var existingAuthor = $filter('filter')(nodes, { name: coAuthor.name  }, true)[0];
                            console.log(existingAuthor);
                            if(typeof existingAuthor === 'undefined') {
                                nodes.push({"name": coAuthor.name, "group": group});
                                nameIntMap.push({"name": coAuthor.name, "int": int});
                                int = int + 1;
                            }
                        })
                    });
                });

                // Pushing to links with master
                angular.forEach(coAuthorInfo, function (author) {

                    var currentAuthor = $filter('filter')(nameIntMap, {name: author.author.name}, true)[0];
                    angular.forEach(author.coAuthors, function (paper) {
                        angular.forEach(paper.authors, function (coAuthor) {
                            var coAuthInt = $filter('filter')(nameIntMap, {name: coAuthor.name}, true)[0];
                            console.log(author.author.name+" "+coAuthor.name);
                            console.log(links);
                            var existingLink = $filter('filter')(links, {source: currentAuthor.int, target: coAuthInt.int}, true)[0];
                            if (typeof existingLink !== 'undefined') {
                                console.log("link exist");
                                links.push({"source": currentAuthor.int, "target": coAuthInt.int, "value": existingLink.value + 5});
                            } else {
                                links.push({"source": currentAuthor.int, "target": coAuthInt.int, "value": 1});
                            }
                        })
                    });
                });

                // angular.forEach(coAuthorInfo, function (author) {
                //
                //     var currentAuthor = $filter('filter')(nameIntMap, {name: author.author.name}, true)[0];
                //     angular.forEach(author.coAuthors, function (paper) {
                //         angular.forEach(paper.authors, function (coAuthor) {
                //             var coAuthInt = $filter('filter')(nameIntMap, {name: coAuthor.name}, true)[0];
                //             var otherAuthors = authorFilter(paper.authors, coAuthor.authorId);
                //
                //             angular.forEach(otherAuthors, function (otherAuthor) {
                //                 var otherAuthor = $filter('filter')(nameIntMap, {name: otherAuthor.name}, true)[0];
                //                 links.push({"source": coAuthInt.int, "target": otherAuthor.int, "value": 1});
                //             });
                //
                //         })
                //     });
                // });

                var color = d3.scale.category20();
                $scope.options = {
                    chart: {
                        type: 'forceDirectedGraph',
                        height: 450,
                        width: (function () {
                            return nv.utils.windowSize().width - 500
                        })(),
                        margin: {top: 20, right: 20, bottom: 20, left: 20},
                        color: function (d) {
                            return color(d.group)
                        },
                        nodeExtras: function (node) {
                            node && node
                                .append("text")
                                .attr("dx", 10)
                                .attr("dy", ".35em")
                                .text(function (d) {
                                    return d.name
                                })
                                .style('font-size', '12px');
                        }
                    }
                };

                console.log("DATA ----------------");
                console.log(nodes);
                console.log(nameIntMap);
                console.log(links);

                $scope.data = {
                    "nodes": nodes,
                    "links": links
                };
                $scope.infoTablePaper = false;
                $scope.infoTableAuthor = false;
                $scope.showAuthorChats = true;
            };


            var authorFilter = function (authors, authorId) {
                var newAuthors = [];
                angular.forEach(authors, function (localAuthor) {

                    if(localAuthor.authorId !== authorId) {
                        newAuthors.push(localAuthor)
                    }
                });

                return newAuthors;
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

            $scope.welcome = "Hello";

            var color = d3.scale.category20();
            $scope.options = {
                chart: {
                    type: 'forceDirectedGraph',
                    height: 450,
                    width: (function () {
                        return nv.utils.windowSize().width - 300
                    })(),
                    margin: {top: 20, right: 20, bottom: 20, left: 20},
                    color: function (d) {
                        return color(d.group)
                    },
                    nodeExtras: function (node) {
                        node && node
                            .append("text")
                            .attr("dx", 8)
                            .attr("dy", ".35em")
                            .text(function (d) {
                                return d.name
                            })
                            .style('font-size', '10px');
                    }
                }
            };

            $scope.data = {
                "nodes": [
                    {"name": "Myriel", "group": 1},
                    {"name": "Napoleon", "group": 1},
                    {"name": "Mlle.Baptistine", "group": 1},
                    {"name": "Mme.Magloire", "group": 1},
                    {"name": "CountessdeLo", "group": 1},
                    {"name": "Geborand", "group": 1},
                    {"name": "Champtercier", "group": 1},
                    {"name": "Cravatte", "group": 1},
                    {"name": "Count", "group": 1},
                    {"name": "OldMan", "group": 1},
                    {"name": "Labarre", "group": 2},
                    {"name": "Valjean", "group": 2},
                    {"name": "Marguerite", "group": 3},
                    {"name": "Mme.deR", "group": 2},
                    {"name": "Isabeau", "group": 2},
                    {"name": "Gervais", "group": 2},
                    {"name": "Tholomyes", "group": 3},
                    {"name": "Listolier", "group": 3},
                    {"name": "Fameuil", "group": 3},
                    {"name": "Blacheville", "group": 3},
                    {"name": "Favourite", "group": 3},
                    {"name": "Dahlia", "group": 3},
                    {"name": "Zephine", "group": 3},
                    {"name": "Fantine", "group": 3},
                    {"name": "Mme.Thenardier", "group": 4},
                    {"name": "Thenardier", "group": 4},
                    {"name": "Cosette", "group": 5},
                    {"name": "Javert", "group": 4},
                    {"name": "Fauchelevent", "group": 0},
                    {"name": "Bamatabois", "group": 2},
                    {"name": "Perpetue", "group": 3},
                    {"name": "Simplice", "group": 2},
                    {"name": "Scaufflaire", "group": 2},
                    {"name": "Woman1", "group": 2},
                    {"name": "Judge", "group": 2},
                    {"name": "Champmathieu", "group": 2},
                    {"name": "Brevet", "group": 2},
                    {"name": "Chenildieu", "group": 2},
                    {"name": "Cochepaille", "group": 2},
                    {"name": "Pontmercy", "group": 4},
                    {"name": "Boulatruelle", "group": 6},
                    {"name": "Eponine", "group": 4},
                    {"name": "Anzelma", "group": 4},
                    {"name": "Woman2", "group": 5},
                    {"name": "MotherInnocent", "group": 0},
                    {"name": "Gribier", "group": 0},
                    {"name": "Jondrette", "group": 7},
                    {"name": "Mme.Burgon", "group": 7},
                    {"name": "Gavroche", "group": 8},
                    {"name": "Gillenormand", "group": 5},
                    {"name": "Magnon", "group": 5},
                    {"name": "Mlle.Gillenormand", "group": 5},
                    {"name": "Mme.Pontmercy", "group": 5},
                    {"name": "Mlle.Vaubois", "group": 5},
                    {"name": "Lt.Gillenormand", "group": 5},
                    {"name": "Marius", "group": 8},
                    {"name": "BaronessT", "group": 5},
                    {"name": "Mabeuf", "group": 8},
                    {"name": "Enjolras", "group": 8},
                    {"name": "Combeferre", "group": 8},
                    {"name": "Prouvaire", "group": 8},
                    {"name": "Feuilly", "group": 8},
                    {"name": "Courfeyrac", "group": 8},
                    {"name": "Bahorel", "group": 8},
                    {"name": "Bossuet", "group": 8},
                    {"name": "Joly", "group": 8},
                    {"name": "Grantaire", "group": 8},
                    {"name": "MotherPlutarch", "group": 9},
                    {"name": "Gueulemer", "group": 4},
                    {"name": "Babet", "group": 4},
                    {"name": "Claquesous", "group": 4},
                    {"name": "Montparnasse", "group": 4},
                    {"name": "Toussaint", "group": 5},
                    {"name": "Child1", "group": 10},
                    {"name": "Child2", "group": 10},
                    {"name": "Brujon", "group": 4},
                    {"name": "Mme.Hucheloup", "group": 8}
                ],
                "links": [
                    {"source": 1, "target": 0, "value": 1},
                    {"source": 2, "target": 0, "value": 8},
                    {"source": 3, "target": 0, "value": 10},
                    {"source": 3, "target": 2, "value": 6},
                    {"source": 4, "target": 0, "value": 1},
                    {"source": 5, "target": 0, "value": 1},
                    {"source": 6, "target": 0, "value": 1},
                    {"source": 7, "target": 0, "value": 1},
                    {"source": 8, "target": 0, "value": 2},
                    {"source": 9, "target": 0, "value": 1},
                    {"source": 11, "target": 10, "value": 1},
                    {"source": 11, "target": 3, "value": 3},
                    {"source": 11, "target": 2, "value": 3},
                    {"source": 11, "target": 0, "value": 5},
                    {"source": 12, "target": 11, "value": 1},
                    {"source": 13, "target": 11, "value": 1},
                    {"source": 14, "target": 11, "value": 1},
                    {"source": 15, "target": 11, "value": 1},
                    {"source": 17, "target": 16, "value": 4},
                    {"source": 18, "target": 16, "value": 4},
                    {"source": 18, "target": 17, "value": 4},
                    {"source": 19, "target": 16, "value": 4},
                    {"source": 19, "target": 17, "value": 4},
                    {"source": 19, "target": 18, "value": 4},
                    {"source": 20, "target": 16, "value": 3},
                    {"source": 20, "target": 17, "value": 3},
                    {"source": 20, "target": 18, "value": 3},
                    {"source": 20, "target": 19, "value": 4},
                    {"source": 21, "target": 16, "value": 3},
                    {"source": 21, "target": 17, "value": 3},
                    {"source": 21, "target": 18, "value": 3},
                    {"source": 21, "target": 19, "value": 3},
                    {"source": 21, "target": 20, "value": 5},
                    {"source": 22, "target": 16, "value": 3},
                    {"source": 22, "target": 17, "value": 3},
                    {"source": 22, "target": 18, "value": 3},
                    {"source": 22, "target": 19, "value": 3},
                    {"source": 22, "target": 20, "value": 4},
                    {"source": 22, "target": 21, "value": 4},
                    {"source": 23, "target": 16, "value": 3},
                    {"source": 23, "target": 17, "value": 3},
                    {"source": 23, "target": 18, "value": 3},
                    {"source": 23, "target": 19, "value": 3},
                    {"source": 23, "target": 20, "value": 4},
                    {"source": 23, "target": 21, "value": 4},
                    {"source": 23, "target": 22, "value": 4},
                    {"source": 23, "target": 12, "value": 2},
                    {"source": 23, "target": 11, "value": 9},
                    {"source": 24, "target": 23, "value": 2},
                    {"source": 24, "target": 11, "value": 7},
                    {"source": 25, "target": 24, "value": 13},
                    {"source": 25, "target": 23, "value": 1},
                    {"source": 25, "target": 11, "value": 12},
                    {"source": 26, "target": 24, "value": 4},
                    {"source": 26, "target": 11, "value": 31},
                    {"source": 26, "target": 16, "value": 1},
                    {"source": 26, "target": 25, "value": 1},
                    {"source": 27, "target": 11, "value": 17},
                    {"source": 27, "target": 23, "value": 5},
                    {"source": 27, "target": 25, "value": 5},
                    {"source": 27, "target": 24, "value": 1},
                    {"source": 27, "target": 26, "value": 1},
                    {"source": 28, "target": 11, "value": 8},
                    {"source": 28, "target": 27, "value": 1},
                    {"source": 29, "target": 23, "value": 1},
                    {"source": 29, "target": 27, "value": 1},
                    {"source": 29, "target": 11, "value": 2},
                    {"source": 30, "target": 23, "value": 1},
                    {"source": 31, "target": 30, "value": 2},
                    {"source": 31, "target": 11, "value": 3},
                    {"source": 31, "target": 23, "value": 2},
                    {"source": 31, "target": 27, "value": 1},
                    {"source": 32, "target": 11, "value": 1},
                    {"source": 33, "target": 11, "value": 2},
                    {"source": 33, "target": 27, "value": 1},
                    {"source": 34, "target": 11, "value": 3},
                    {"source": 34, "target": 29, "value": 2},
                    {"source": 35, "target": 11, "value": 3},
                    {"source": 35, "target": 34, "value": 3},
                    {"source": 35, "target": 29, "value": 2},
                    {"source": 36, "target": 34, "value": 2},
                    {"source": 36, "target": 35, "value": 2},
                    {"source": 36, "target": 11, "value": 2},
                    {"source": 36, "target": 29, "value": 1},
                    {"source": 37, "target": 34, "value": 2},
                    {"source": 37, "target": 35, "value": 2},
                    {"source": 37, "target": 36, "value": 2},
                    {"source": 37, "target": 11, "value": 2},
                    {"source": 37, "target": 29, "value": 1},
                    {"source": 38, "target": 34, "value": 2},
                    {"source": 38, "target": 35, "value": 2},
                    {"source": 38, "target": 36, "value": 2},
                    {"source": 38, "target": 37, "value": 2},
                    {"source": 38, "target": 11, "value": 2},
                    {"source": 38, "target": 29, "value": 1},
                    {"source": 39, "target": 25, "value": 1},
                    {"source": 40, "target": 25, "value": 1},
                    {"source": 41, "target": 24, "value": 2},
                    {"source": 41, "target": 25, "value": 3},
                    {"source": 42, "target": 41, "value": 2},
                    {"source": 42, "target": 25, "value": 2},
                    {"source": 42, "target": 24, "value": 1},
                    {"source": 43, "target": 11, "value": 3},
                    {"source": 43, "target": 26, "value": 1},
                    {"source": 43, "target": 27, "value": 1},
                    {"source": 44, "target": 28, "value": 3},
                    {"source": 44, "target": 11, "value": 1},
                    {"source": 45, "target": 28, "value": 2},
                    {"source": 47, "target": 46, "value": 1},
                    {"source": 48, "target": 47, "value": 2},
                    {"source": 48, "target": 25, "value": 1},
                    {"source": 48, "target": 27, "value": 1},
                    {"source": 48, "target": 11, "value": 1},
                    {"source": 49, "target": 26, "value": 3},
                    {"source": 49, "target": 11, "value": 2},
                    {"source": 50, "target": 49, "value": 1},
                    {"source": 50, "target": 24, "value": 1},
                    {"source": 51, "target": 49, "value": 9},
                    {"source": 51, "target": 26, "value": 2},
                    {"source": 51, "target": 11, "value": 2},
                    {"source": 52, "target": 51, "value": 1},
                    {"source": 52, "target": 39, "value": 1},
                    {"source": 53, "target": 51, "value": 1},
                    {"source": 54, "target": 51, "value": 2},
                    {"source": 54, "target": 49, "value": 1},
                    {"source": 54, "target": 26, "value": 1},
                    {"source": 55, "target": 51, "value": 6},
                    {"source": 55, "target": 49, "value": 12},
                    {"source": 55, "target": 39, "value": 1},
                    {"source": 55, "target": 54, "value": 1},
                    {"source": 55, "target": 26, "value": 21},
                    {"source": 55, "target": 11, "value": 19},
                    {"source": 55, "target": 16, "value": 1},
                    {"source": 55, "target": 25, "value": 2},
                    {"source": 55, "target": 41, "value": 5},
                    {"source": 55, "target": 48, "value": 4},
                    {"source": 56, "target": 49, "value": 1},
                    {"source": 56, "target": 55, "value": 1},
                    {"source": 57, "target": 55, "value": 1},
                    {"source": 57, "target": 41, "value": 1},
                    {"source": 57, "target": 48, "value": 1},
                    {"source": 58, "target": 55, "value": 7},
                    {"source": 58, "target": 48, "value": 7},
                    {"source": 58, "target": 27, "value": 6},
                    {"source": 58, "target": 57, "value": 1},
                    {"source": 58, "target": 11, "value": 4},
                    {"source": 59, "target": 58, "value": 15},
                    {"source": 59, "target": 55, "value": 5},
                    {"source": 59, "target": 48, "value": 6},
                    {"source": 59, "target": 57, "value": 2},
                    {"source": 60, "target": 48, "value": 1},
                    {"source": 60, "target": 58, "value": 4},
                    {"source": 60, "target": 59, "value": 2},
                    {"source": 61, "target": 48, "value": 2},
                    {"source": 61, "target": 58, "value": 6},
                    {"source": 61, "target": 60, "value": 2},
                    {"source": 61, "target": 59, "value": 5},
                    {"source": 61, "target": 57, "value": 1},
                    {"source": 61, "target": 55, "value": 1},
                    {"source": 62, "target": 55, "value": 9},
                    {"source": 62, "target": 58, "value": 17},
                    {"source": 62, "target": 59, "value": 13},
                    {"source": 62, "target": 48, "value": 7},
                    {"source": 62, "target": 57, "value": 2},
                    {"source": 62, "target": 41, "value": 1},
                    {"source": 62, "target": 61, "value": 6},
                    {"source": 62, "target": 60, "value": 3},
                    {"source": 63, "target": 59, "value": 5},
                    {"source": 63, "target": 48, "value": 5},
                    {"source": 63, "target": 62, "value": 6},
                    {"source": 63, "target": 57, "value": 2},
                    {"source": 63, "target": 58, "value": 4},
                    {"source": 63, "target": 61, "value": 3},
                    {"source": 63, "target": 60, "value": 2},
                    {"source": 63, "target": 55, "value": 1},
                    {"source": 64, "target": 55, "value": 5},
                    {"source": 64, "target": 62, "value": 12},
                    {"source": 64, "target": 48, "value": 5},
                    {"source": 64, "target": 63, "value": 4},
                    {"source": 64, "target": 58, "value": 10},
                    {"source": 64, "target": 61, "value": 6},
                    {"source": 64, "target": 60, "value": 2},
                    {"source": 64, "target": 59, "value": 9},
                    {"source": 64, "target": 57, "value": 1},
                    {"source": 64, "target": 11, "value": 1},
                    {"source": 65, "target": 63, "value": 5},
                    {"source": 65, "target": 64, "value": 7},
                    {"source": 65, "target": 48, "value": 3},
                    {"source": 65, "target": 62, "value": 5},
                    {"source": 65, "target": 58, "value": 5},
                    {"source": 65, "target": 61, "value": 5},
                    {"source": 65, "target": 60, "value": 2},
                    {"source": 65, "target": 59, "value": 5},
                    {"source": 65, "target": 57, "value": 1},
                    {"source": 65, "target": 55, "value": 2},
                    {"source": 66, "target": 64, "value": 3},
                    {"source": 66, "target": 58, "value": 3},
                    {"source": 66, "target": 59, "value": 1},
                    {"source": 66, "target": 62, "value": 2},
                    {"source": 66, "target": 65, "value": 2},
                    {"source": 66, "target": 48, "value": 1},
                    {"source": 66, "target": 63, "value": 1},
                    {"source": 66, "target": 61, "value": 1},
                    {"source": 66, "target": 60, "value": 1},
                    {"source": 67, "target": 57, "value": 3},
                    {"source": 68, "target": 25, "value": 5},
                    {"source": 68, "target": 11, "value": 1},
                    {"source": 68, "target": 24, "value": 1},
                    {"source": 68, "target": 27, "value": 1},
                    {"source": 68, "target": 48, "value": 1},
                    {"source": 68, "target": 41, "value": 1},
                    {"source": 69, "target": 25, "value": 6},
                    {"source": 69, "target": 68, "value": 6},
                    {"source": 69, "target": 11, "value": 1},
                    {"source": 69, "target": 24, "value": 1},
                    {"source": 69, "target": 27, "value": 2},
                    {"source": 69, "target": 48, "value": 1},
                    {"source": 69, "target": 41, "value": 1},
                    {"source": 70, "target": 25, "value": 4},
                    {"source": 70, "target": 69, "value": 4},
                    {"source": 70, "target": 68, "value": 4},
                    {"source": 70, "target": 11, "value": 1},
                    {"source": 70, "target": 24, "value": 1},
                    {"source": 70, "target": 27, "value": 1},
                    {"source": 70, "target": 41, "value": 1},
                    {"source": 70, "target": 58, "value": 1},
                    {"source": 71, "target": 27, "value": 1},
                    {"source": 71, "target": 69, "value": 2},
                    {"source": 71, "target": 68, "value": 2},
                    {"source": 71, "target": 70, "value": 2},
                    {"source": 71, "target": 11, "value": 1},
                    {"source": 71, "target": 48, "value": 1},
                    {"source": 71, "target": 41, "value": 1},
                    {"source": 71, "target": 25, "value": 1},
                    {"source": 72, "target": 26, "value": 2},
                    {"source": 72, "target": 27, "value": 1},
                    {"source": 72, "target": 11, "value": 1},
                    {"source": 73, "target": 48, "value": 2},
                    {"source": 74, "target": 48, "value": 2},
                    {"source": 74, "target": 73, "value": 3},
                    {"source": 75, "target": 69, "value": 3},
                    {"source": 75, "target": 68, "value": 3},
                    {"source": 75, "target": 25, "value": 3},
                    {"source": 75, "target": 48, "value": 1},
                    {"source": 75, "target": 41, "value": 1},
                    {"source": 75, "target": 70, "value": 1},
                    {"source": 75, "target": 71, "value": 1},
                    {"source": 76, "target": 64, "value": 1},
                    {"source": 76, "target": 65, "value": 1},
                    {"source": 76, "target": 66, "value": 1},
                    {"source": 76, "target": 63, "value": 1},
                    {"source": 76, "target": 62, "value": 1},
                    {"source": 76, "target": 48, "value": 1},
                    {"source": 76, "target": 58, "value": 1}
                ]
            }
        });
})();