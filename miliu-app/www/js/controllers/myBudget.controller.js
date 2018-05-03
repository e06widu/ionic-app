(function () {
    'use strict';
    angular
        .module('miliu')
        .controller('MyBudgetController', MyBudgetController);

    MyBudgetController.$inject = ['$state', 'miliuService', '$scope','$timeout', '$interval']

    /**
     * Create MyBudgetController
     *
     * @param {any} $state
     * @param {any} miliuService
     */
    function MyBudgetController($state, miliuService, $scope,$timeout,$interval) {
        var vm = this;
        var today = new Date();
        var days = today.getDate();
        var isDataLoaded = false;

        vm.navigate = navigate;

        vm.myIncome = {
            total: 0,
            categories: []
        };

        vm.mySpend = {
            totalBudget: 0,
            totalSpend: 0,
            topCategories: [],
            otherCategories: [],
            showOtherCategories: false
        };

        vm.myBorrowings = {
            totalBudget: 0,
            totalSpend: 0,
            topCategories: [],
            otherCategories: [],
            showOtherCategories: false
        };

        vm.myProtection = {
            totalBudget: 0,
            totalSpend: 0,
            topCategories: [],
            otherCategories: [],
            showOtherCategories: false
        };

        vm.myGrowth = {
            totalAmount: 0,
            savedAmount: 0,
            topGrowthCategories: [],
            otherGrowthCategories: [],
            showOtherCategories: false
        }

        activate();

        /**
         * Initialize the My Budgets data loading from API
         *
         * @returns
         */
        function activate() {
            return getMyBudget().then(() => {
                //log info if any
            });
        }

        /**
         * Get My Budget data from the service
         *
         * @returns
         */
        function getMyBudget() {
            miliuService.preloaderShow();
            return miliuService.myBudget()
                .then((data) => {
                    isDataLoaded = true;
                    if (data.myIncome.length > 0) {
                        _.forEach(data.myIncome, (income) => {
                            vm.myIncome.total += income.amount;
                        })

                        vm.myIncome.categories = data.myIncome;
                    }

                    vm.mySpend.totalBudget = data.mySpend.totalBudget;
                    vm.mySpend.totalSpend = data.mySpend.totalSpend;
                    vm.mySpend.topCategories = data.mySpend.topCategories;
                    vm.mySpend.otherCategories = data.mySpend.otherCategories;

                    vm.myBorrowings.totalBudget = data.myBorrowings.totalBudget;
                    vm.myBorrowings.totalSpend = data.myBorrowings.totalSpend;
                    vm.myBorrowings.topCategories = data.myBorrowings.topCategories;
                    vm.myBorrowings.otherCategories = data.myBorrowings.otherCategories;

                    vm.myProtection.totalBudget = data.myProtection.totalBudget;
                    vm.myProtection.totalSpend = data.myProtection.totalSpend;
                    vm.myProtection.topCategories = data.myProtection.topCategories;
                    vm.myProtection.otherCategories = data.myProtection.otherCategories;

                    vm.myGrowth.totalAmount = data.myGrowth.totalAmount;
                    vm.myGrowth.savedAmount = data.myGrowth.savedAmount;
                    vm.myGrowth.topGrowthCategories = data.myGrowth.topGrowthCategories;
                    vm.myGrowth.otherGrowthCategories = data.myGrowth.otherGrowthCategories;
                    //vm.myGrowth.topGrowthCategories = setupGrowthCategoryData(data.myGrowth.topGrowthCategories);
                    //vm.myGrowth.otherGrowthCategories = setupGrowthCategoryData(data.myGrowth.otherGrowthCategories);
                    miliuService.preloaderHide();
                    return data;
                }, () => {
                    miliuService.preloaderHide();
                });
        }

        /**
         * Set up growth category data
         *
         * @param {any} growthCategories
         * @returns
         */
        function setupGrowthCategoryData(growthCategories) {
            _.forEach(growthCategories, (category) => {
                category.graphData = getGraphData(category.graphData);
            })

            return growthCategories;
        }

        /**
         * Get formated data to populate graph
         *
         * @param {any} graphData
         * @returns
         */
        function getGraphData(graphData) {
            var labels = [];
            var data = [];

            var i = 0;
            for (i; i < days; i++) {
                var date = i + 1;

                labels.push((today.getMonth() + 1) + '/' + date);

                var growth = _.find(graphData, { date: date });

                if (growth) {
                    data.push(growth.percentage);
                } else {
                    data.push(0);
                }
            }

            return { labels: labels, data: data }
        }

        /**
         * Navigate clicking on nav bar button
         *
         * @param {any} state - state of the page
         */
        function navigate(state) {
            $state.go(state);
        }

        $scope.$on('$ionicView.beforeEnter', function (e, data) {
            $scope.$root.showMenuIcon = true;
            $scope.$root.showBackIcon = true;
            $scope.$root.menuIconColor = '#0594d9';
        });

        $scope.$on('$ionicView.enter', function () {
            if (isDataLoaded) {
                miliuService.preloaderHide();
            }
        });

        $scope.$on('$ionicView.beforeLeave', function () {
            miliuService.preloaderShow();
        });

        vm.initGenerateChart = initGenerateChart;

        function initGenerateChart(canvasId,graphData){
            $timeout(()=>{
                generateChart(canvasId,graphData);
            },1);
        }

        $scope.charts = {};

        function generateChart(canvasId,graphData){
          console.log('geneartion');
            var ctx = document.getElementById(canvasId).getContext("2d")
            var gradientStroke = ctx.createLinearGradient(250, 0, 150, 0);
            gradientStroke.addColorStop(0, "#f49080");
            gradientStroke.addColorStop(1, "#80b6f4");
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: graphData.labels,
                    datasets: [{
                        label: "Data",
                        borderColor: gradientStroke,
                        pointBorderColor: gradientStroke,
                        pointBackgroundColor: gradientStroke,
                        pointHoverBackgroundColor: gradientStroke,
                        pointHoverBorderColor: gradientStroke,
                        pointBorderWidth: 10,
                        pointHoverRadius: 0,
                        pointRadius: 0,
                        pointHitRadius: 40,
                        fill: false,
                        borderWidth: 4,
                        data: graphData.data
                    }]
                },
                plugins: [{

                  beforeRender: function() {
                      Object.getOwnPropertyNames($scope.charts).forEach(function(key) {
                          var chart = $scope.charts[key];
                          if (!chart.highlightedPoint) return;
                          // Sometimes the highlighted point radius goes back to default 0. So we set it to 5 before every render
                          chart.highlightedPoint._model.radius = 5;

                          if (chart.tooltip._active && chart.tooltip._active.length) return;
                          // This to reset tooltips of all other charts. Because chart.js generally removes them from every chart except the one interacted by the user.
                          chart.tooltip._active = [chart.highlightedPoint];
                          chart.tooltip.update(true);
                          chart.render();
                      });
                  }
                }],
                options: {
                    animation: false,
                    layout: {
                        padding: {
                            left: 0,
                            right: 0,
                            top: 30,
                            bottom: 0
                        }
                    },
                    legend: {
                        display: false
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                display: false,
                                fontColor: "rgba(0,0,0,0.5)",
                                fontStyle: "bold",
                                beginAtZero: true,
                                maxTicksLimit: 5,
                                padding: 20
                            },
                            gridLines: {
                                drawTicks: false,
                                display: false,
                                drawBorder: false
                            }
                        }],
                        xAxes: [{
                            gridLines: {
                                zeroLineColor: "transparent",
                                display: false,
                                drawBorder: false
                            },
                            ticks: {
                                padding: 20,
                                fontColor: "rgba(0,0,0,0.5)",
                                fontStyle: "bold"
                            }
                        }]
                    },
                    tooltips: {
                        yAlign: 'bottom',
                        callbacks: {
                            title: function(tooltipItem, data) {
                              return '';
                            },
                            label: function(tooltipItem, data) {

                                // Apart from the tooltip from just displaying text we want to increase the point radius of selected point.
                                // The approach is a little hacky since there's no simply api that enables us to do this
                                // Using the hoverRadius approach has issues like not being able to programmatically hover on a point (useful for default highlighted point)
                                // Also, chart.js basically removes tooltips/hovers from all other charts when user interacts with any chart. This is an issue since we have mulitple charts on same package

                                // The '_meta' object is an object with a single property whose key is the index of the chart
                                var key = Object.getOwnPropertyNames(data.datasets[0]._meta)[0];
                                // For each point we set the radius manually to either 5 or 0
                                data.datasets[0]._meta[key].data.forEach(function(point, index) {
                                    point._model.radius = index !== tooltipItem.index ? 0 : 5;
                                });

                                // Marking the new highlighted point so the beforeRenderHook can enforce it's highlight on every render
                                $scope.charts[key].highlightedPoint = data.datasets[0]._meta[key].data[tooltipItem.index];

                                var percent = data.datasets[0].data[tooltipItem.index];
                                return percent + '%';
                            },
                            labelTextColor:function(tooltipItem, chart){
                                var indexFraction = tooltipItem.index * 1.0 / chart.config.data.labels.length;
                                return indexFraction < 0.5 ? '#126CD3' : '#F64F31';
                            }
                        },
                        backgroundColor: 'transparent',
                        bodyFontSize: 12,
                        displayColors: false,
                        bodyFontStyle: 'bold',
                        bodyFontFamily:'Arial',
                        showAllToolTips: true,
                    },

                }
            });

            // Autofocusing the 50% point for every chart by default
            var indexOfFifty = graphData.data.indexOf(50);

            var key = Object.getOwnPropertyNames(myChart.data.datasets[0]._meta)[0];
            var activePoint = myChart.data.datasets[0]._meta[key].data[indexOfFifty];

            $scope.charts[key] = myChart;

            $timeout(function() {
                myChart.tooltip.initialize();
                myChart.tooltip._active = [activePoint];
                myChart.tooltip.update(true);
                myChart.render();
            }, 50);


        }
    }
}())
