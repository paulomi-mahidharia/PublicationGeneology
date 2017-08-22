"use strict";

(function () {
    angular.module('app', ['nvd3', 'ng-fusioncharts', 'ngMaterial'])
        .controller('Nvd3Controller', function ($scope, $filter, $q, $timeout, AppService) {

            $scope.pageTitle = "Search by Author or Paper title/keyword";
            $scope.infoTableAuthor = false;
            $scope.infoTablePaper = false;
            $scope.showAuthorChats = false;
            $scope.infoTableAuthorByConference = false;
            $scope.foundCoAuthors = false;

            var nodes = [];
            var links = [];
            var group = 0;
            var nameIntMap = [];
            var int = 0;
            var coAuthorInfo = [];
            var categories = [];
            var data = [];

            console.log($scope.result);

            function init() {

                $scope.pageTitle = "Search by Author or Paper title/keyword";
                $scope.infoTableAuthor = false;
                $scope.infoTablePaper = false;
                $scope.showAuthorChats = false;
                $scope.foundCoAuthors = false;

                $scope.topValue = "10";
                $scope.topValues = ["5", "10", "20", "30"];

                $scope.conferences = [];

                AppService.getAllConferences()
                    .then(function (response) {
                        angular.forEach(response.data, function (conf) {
                            if ($scope.conferences.indexOf(conf.name) == -1) {
                                $scope.conferences.push(conf.name);
                            }
                        });

                        console.log("CONF");
                        console.log($scope.conferences);
                    })

            }

            init();

            $scope.getConferences = function (searchText) {
                var deferred = $q.defer();

                $timeout(function () {
                    var conferences = $scope.conferences.filter(function (conference) {
                        return (conference.toLowerCase().indexOf(searchText.toLowerCase()) !== -1);
                    });
                    deferred.resolve(conferences);
                }, 1500);

                return deferred.promise;
            };


            $scope.searchPublication = function () {

                nodes = [];
                links = [];
                group = 0;
                nameIntMap = [];
                int = 0;
                coAuthorInfo = [];
                categories = [];
                data = [];

                $scope.foundCoAuthors = false;
                $scope.predicate = '';
                $scope.loadingSpinnerForTable = true;
                $scope.showChats = false;
                $scope.showAuthorChats = false;
                $scope.showConfAuthorCharts = false;
                $scope.showCitationCharts = false;
                $scope.infoTableTopCitedPapers = false;

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

                if (selection === 'conference') {

                    $scope.loadingSpinnerForTable = false;
                    $scope.loading = true;

                    var conferenceName = $scope.conferenceName;
                    console.log(conferenceName);

                    AppService.getTopAuthorsForConference(conferenceName, $scope.topValue)
                        .then(function (response) {
                            console.log(response.data);
                            $scope.loading = false;
                            $scope.predicate = 'conference';
                            $scope.authorsForConf = response.data;
                            $scope.infoTableAuthorByConference = true;
                        });
                }

                if (selection == 'paperCitation') {
                    console.log("CITING");
                    categories = [];
                    data = [];

                    $scope.loadingSpinnerForTable = false;
                    $scope.loading = true;

                    AppService.getTopCitedPapersForTopic($scope.topic)
                        .then(function (response) {
                            console.log("TOP CITE");
                            console.log(response.data);
                            $scope.topCitedPapers = response.data;
                            $scope.loading = false;
                            $scope.infoTableTopCitedPapers = true;

                            angular.forEach($scope.topCitedPapers, function (paper) {
                                // categories.push({"label": paper.title});
                                // data.push({"value": paper.citations});

                                data.push({label: paper.title,
                                    value: paper.citations,
                                    link: "P-detailsWin,width=400,height=300,toolbar=no,scrollbars=yes, resizable=no-"+paper.citationsList});
                            })
                        })
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
                $scope.infoTableAuthorByConference = false;
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

                nodes = [];
                links = [];
                group = 0;
                nameIntMap = [];
                int = 0;
                coAuthorInfo = [];

                console.log(paper);
                $scope.loading = true;
                $scope.showChats = false;
                $scope.showAuthorChats = false;
                $scope.selectedPaperAuthors = [];
                $scope.infoTablePaper = false;
                $scope.infoTableAuthor = false;
                $scope.infoTableAuthorByConference = false;
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

                        var i = 0;
                        var authorsLength = $scope.selectedPaperAuthors.length;

                        angular.forEach($scope.selectedPaperAuthors, function (author) {

                            AppService.getCoAuthors(author.authorId, paper.paperId, paper.year)
                                .then(function (response) {
                                    coAuthorInfo.push({author: author, coAuthors: response.data});
                                    console.log("Done");
                                    i = i + 1;
                                    if (i == authorsLength) {
                                        $scope.foundCoAuthors = true;
                                    }

                                });
                        });

                    });
            };

            $scope.newDataSource = {};
            $scope.showTopCitedPapers = function () {

                var globalCategories = [];
                globalCategories.push({"category": categories});

                console.log(data);

                $scope.newDataSource = {

                    chart: {
                        caption: "TopCited papers for " + $scope.topic,
                        subcaption: "Citation v/s Paper",
                        "xaxisname": "Paper",
                        "yaxisname": "Number of Citations",
                        "bgColor": "#ffffff",
                        //numberprefix: "$",
                        theme: "ocean"
                    },
                    data: data

                    //     "categories": globalCategories,
                    //     "dataset": [
                    //     {
                    //         "seriesname": "Top Citations",
                    //         "data": data
                    //     },
                    //     {
                    //         "seriesname": "Top Citations",
                    //         "renderas": "line",
                    //         "showvalues": "0",
                    //         "data": data
                    //     }
                    // ]
                };

                $scope.infoTableTopCitedPapers = false;
                $scope.showCitationCharts = true;
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
                            var existingAuthor = $filter('filter')(nodes, {name: coAuthor.name}, true)[0];
                            console.log(existingAuthor);
                            if (typeof existingAuthor === 'undefined') {
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
                            console.log(author.author.name + " " + coAuthor.name);
                            console.log(links);
                            var existingLink = $filter('filter')(links, {
                                source: currentAuthor.int,
                                target: coAuthInt.int
                            }, true)[0];
                            if (typeof existingLink !== 'undefined') {
                                console.log("link exist");
                                links.push({
                                    "source": currentAuthor.int,
                                    "target": coAuthInt.int,
                                    "value": existingLink.value + 5
                                });
                            } else {
                                links.push({"source": currentAuthor.int, "target": coAuthInt.int, "value": 1});
                            }
                        })
                    });
                });

                angular.forEach(coAuthorInfo, function (author) {

                    var currentAuthor = $filter('filter')(nameIntMap, {name: author.author.name}, true)[0];
                    angular.forEach(author.coAuthors, function (paper) {
                        angular.forEach(paper.authors, function (coAuthor) {
                            var coAuthInt = $filter('filter')(nameIntMap, {name: coAuthor.name}, true)[0];
                            var otherAuthors = authorFilter(paper.authors, coAuthor.authorId);

                            angular.forEach(otherAuthors, function (otherAuthor) {
                                var otherAuthorInt = $filter('filter')(nameIntMap, {name: otherAuthor.name}, true)[0];

                                var existingLink = $filter('filter')(links, {
                                    source: coAuthInt.int,
                                    target: otherAuthorInt.int
                                }, true)[0];

                                if (typeof existingLink !== 'undefined') {
                                    console.log("link exist");
                                    links.push({
                                        "source": coAuthInt.int,
                                        "target": otherAuthorInt.int,
                                        "value": existingLink.value + 5
                                    });
                                } else {
                                    links.push({"source": coAuthInt.int, "target": otherAuthorInt.int, "value": 1});
                                }
                            });

                        })
                    });
                });

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
                        tooltip: {
                            contentGenerator: function (obj) {
                                return "<H3>" + obj.name + "</H3><p>Group: " + obj.group + "</p>"
                            }
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

                    if (localAuthor.authorId !== authorId) {
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

            $scope.showAuthorConfGraph = function () {

                console.log("HERE");
                $scope.options = {
                    chart: {
                        type: 'scatterChart',
                        height: 450,
                        width: 450,
                        color: d3.scale.category10().range(),
                        scatter: {
                            onlyCircles: false
                        },
                        showDistX: true,
                        showDistY: true,
                        tooltip: {
                            contentGenerator: function (key) {
                                return '<H3>' + key.series[0].key + '</H3><p>' + key.point.size + ' papers</p>'
                            }
                        },
                        duration: 350,
                        xAxis: {
                            axisLabel: 'Author',
                            tickFormat: function (d) {
                                return d3.format('.02f')(d);
                            }
                        },
                        yAxis: {
                            axisLabel: 'Y Axis',
                            tickFormat: function (d) {
                                return d3.format('.02f')(d);
                            },
                            axisLabelDistance: -5
                        },
                        zoom: {
                            //NOTE: All attributes below are optional
                            enabled: false,
                            scaleExtent: [1, 10],
                            useFixedDomain: false,
                            useNiceScale: false,
                            horizontalOff: false,
                            verticalOff: false,
                            unzoomEventType: 'dblclick.zoom'
                        }
                    }
                };

                $scope.data = generateData($scope.authorsForConf);
                //$scope.data = generateData(4, 40);

                /* Random Data Generator (took from nvd3.org) */
                function generateData(groups) {
                    var data = [],
                        //shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
                        shapes = ['circle'],
                        random = d3.random.normal();

                    var i = 0;
                    angular.forEach(groups, function (group) {
                        data.push({
                            key: group.name,
                            values: [{
                                x: random()
                                , y: random()
                                , size: group.paperCount
                                , shape: shapes[0]
                            }]
                        });
                        i++;
                    });

                    return data;
                }

                $scope.infoTableAuthorByConference = false;
                $scope.showConfAuthorCharts = true;
            }
        });
})();