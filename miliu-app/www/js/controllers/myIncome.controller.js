angular
    .module('miliu')
    .controller('MyIncomeController', MyIncomeController);

MyIncomeController.$inject = ['$scope', '$state', 'miliuService', '$filter', '$stateParams', 'googleChartApiPromise', '$timeout']

function MyIncomeController($scope, $state, miliuService, $filter, $stateParams, googleChartApiPromise, $timeout) {
    var vm = this;
    var chartObj;
    var today = new Date();
    var periodOfTime = miliuService.filterState ? miliuService.filterState.periodOfTime :
        {
            startDate: new Date(today.getFullYear(), today.getMonth(), 1),
            endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0)
        };
    vm.displayPeriodOfTime = $filter('date')(periodOfTime.startDate, 'd') + ' - ' +
        $filter('date')(periodOfTime.endDate, 'd MMM, yyyy');

    vm.navigate = navigate;
    vm.onChartSwipeLeft = onChartSwipeLeft;
    vm.onChartSwipeRight = onChartSwipeRight;
    vm.startDateIndex = 0;
    vm.totalIncome = $stateParams.myIncomeParam ? $stateParams.myIncomeParam.totalIncome : 0;
    vm.calandarData = [];

    var agcContainer;
    vm.agcOnMouseout = changeAgcBorderRadius;
    vm.agcOnMouseover = changeAgcBorderRadius;
    vm.agcOnSelect = changeAgcBorderRadius;
    vm.agcOnReady = changeAgcBorderRadius;

    getMyIncomeData();

    function getMyIncomeData() {
        miliuService.preloaderShow();
        return miliuService.getMyIncomeData()
            .then(function (data) {
                vm.calandarData = _.filter(data.calandarData, (cData) => {
                    return today >= new Date(cData.date)
                });

                vm.calandarData = _.filter(vm.calandarData, (cData) => {
                    return periodOfTime.startDate <= new Date(cData.date)
                })

                vm.startDateIndex = vm.calandarData.length - 7;
                vm.startDateIndex = vm.startDateIndex >= 0 ? vm.startDateIndex : 0;
                vm.displayData = vm.calandarData.slice(vm.startDateIndex, (vm.startDateIndex + 7));
                chartObj = data.myChartObject;
                vm.myChartObject = initChart();
                miliuService.preloaderHide();
            }, function () {
                miliuService.preloaderHide();
            });
    }

    function onChartSwipeLeft() {
        console.log('swap left');
        if (vm.startDateIndex < (vm.calandarData.length - 1)) {
            vm.startDateIndex++;
            vm.displayData = vm.calandarData.slice(vm.startDateIndex, (vm.startDateIndex + 7));
            vm.myChartObject = initChart();
        }
    }

    function onChartSwipeRight() {
        console.log('swap right');
        if (vm.startDateIndex > 0) {
            vm.startDateIndex--;
            vm.displayData = vm.calandarData.slice(vm.startDateIndex, (vm.startDateIndex + 7));
            vm.myChartObject = initChart();
        }
    }

    function initChart() {
        chartObj.data.rows = vm.displayData
        return chartObj;
    }


    /**
     * Navigate clicking on button
     * 
     * @param {any} state - state of the page
     */
    function navigate(state) {
        console.log(state);
        $state.go(state)
    }

    googleChartApiPromise.then(() => {
        $timeout(() => {
            agcContainer = document.getElementById('agcMyIncomeDiv');
            changeAgcBorderRadius();
        }, 100)

    })

    function changeAgcBorderRadius() {
        if (agcContainer) {
            chartColumns = agcContainer.getElementsByTagName('rect');
            Array.prototype.forEach.call(chartColumns, function (column) {
                column.setAttribute('rx', 5);
                column.setAttribute('ry', 5);
            });
        }
    }

    $scope.$on('$ionicView.beforeEnter', function (e, data) {
        $scope.$root.showMenuIcon = false;
        $scope.$root.showBackIcon = true;
        $scope.$root.menuIconColor = '#0594d9';
    });

    $scope.$on('$ionicView.beforeLeave', function () {
        miliuService.preloaderShow();
    });

}