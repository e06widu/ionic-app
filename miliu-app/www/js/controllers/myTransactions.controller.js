angular
    .module('miliu')
    .controller('MyTransactionsController', MyTransactionsController);
MyTransactionsController.$inject = ['$scope', '$state', 'miliuService', '$rootScope', '$filter']

function MyTransactionsController($scope, $state, miliuService, $rootScope, $filter) {
    var vm = this;
    var category;
    var filterObj = miliuService.filterState;
    var today = new Date();
    var isDataLoaded = false;
    vm.selectedCategory;
    vm.onSwipeLeft = onSwipeLeft;
    vm.navigate = navigate;
    vm.loadSpendsData = loadSpendsData;
    vm.loadIncomeData = loadIncomeData;
    vm.totalSpend = 0;
    vm.totalIncome = 0;
    vm.timePeriod = '';
    vm.selectItem = selectItem;
    vm.loadTransactionViews = loadTransactionViews;
    vm.isTotalSpendSelected = true;
    vm.chartObject;
    vm.onCategoryTap = onCategoryTap;
    vm.colapseCategory = colapseCategory;

    vm.sortBy = sortBy;
    vm.propertyName = 'amount';
    vm.reverse = true;

    vm.myTransactions = {};
    vm.transactions = [];

    getMyTransactions();

    function getMyTransactions() {
        miliuService.preloaderShow();
        return miliuService.getMyTransactions()
            .then(function (data) {
                isDataLoaded = true;
                vm.myTransactions = data;
                console.log(vm.myTransactions);
                loadSpendsData();
                miliuService.preloaderHide();
            }, function () {
                miliuService.preloaderHide();
            });
    }

    function sortBy(propertyName) {
        vm.reverse = (vm.propertyName === propertyName) ? !vm.reverse : false;
        vm.propertyName = propertyName;
    }

    function onCategoryTap(category) {
        if (vm.isTotalSpendSelected) {
            vm.selectedCategory = category
        }
    }

    function colapseCategory() {
        vm.selectedCategory = null;
    }

    /**
     * load the data related to spending
     * 
     */
    function loadSpendsData() {
        vm.isTotalSpendSelected = true;

        if (!filterObj) {
            vm.transactions = vm.myTransactions.allAccount.thisMonth.spends;
            vm.totalSpend = vm.myTransactions.allAccount.thisMonth.totalSpend;
            vm.totalIncome = vm.myTransactions.allAccount.thisMonth.totalIncome;
            vm.timePeriod = vm.myTransactions.allAccount.thisMonth.timePeriod;
            vm.chartObject = vm.myTransactions.allAccount.thisMonth.spendChartObject;

            var periodOfTime =
                {
                    startDate: new Date(today.getFullYear(), today.getMonth(), 1),
                    endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0)
                };

            setDisplayTimePeriod(periodOfTime);
        } else {
            //Apply filter if any
            applyFilterToCommonData();
            applyFilterToSpendsData();
            setDisplayTimePeriod(filterObj.periodOfTime);
        }
    }

    /**
     * load the data related to income
     * 
     */
    function loadIncomeData() {
        vm.isTotalSpendSelected = false;
        vm.selectedCategory = null;

        if (!filterObj) {
            vm.transactions = vm.myTransactions.allAccount.thisMonth.incomes;
            vm.totalSpend = vm.myTransactions.allAccount.thisMonth.totalSpend;
            vm.totalIncome = vm.myTransactions.allAccount.thisMonth.totalIncome;
            vm.timePeriod = vm.myTransactions.allAccount.thisMonth.timePeriod;
            vm.chartObject = vm.myTransactions.allAccount.thisMonth.incomeChartObject;

            var periodOfTime =
                {
                    startDate: new Date(today.getFullYear(), today.getMonth(), 1),
                    endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0)
                };

            setDisplayTimePeriod(periodOfTime);
        } else {
            //Apply filter if any
            applyFilterToCommonData();
            applyFilterToIncomeData();
            setDisplayTimePeriod(filterObj.periodOfTime);
        }
    }

    function selectItem() {
        if (!vm.isTotalSpendSelected) {
            $state.go('app.myIncome')
        }
    }

    function loadTransactionViews() {

        if (!vm.isTotalSpendSelected) {
            $state.go('app.myIncome', { myIncomeParam: { totalIncome: vm.totalIncome } })
        } else {
            $state.go('app.mySpend', { mySpendParam: { totalSpend: vm.totalSpend } })
        }
    }

    /**
     * Navigate clicking on menu
     * 
     * @param {any} state - state of the page
     */
    function navigate(state) {
        $state.go(state)
    }

    function onSwipeLeft() {
        $state.go('app.myTransactionsDaily');
    }

    function setDisplayTimePeriod(periodOfTime) {
        vm.timePeriod = $filter('date')(periodOfTime.startDate, 'd') + ' - ' +
            $filter('date')(periodOfTime.endDate, 'd MMM, yyyy');
    }

    /**
     *Listening to the filteration change event
     * 
     */
    $rootScope.$on('applyFilter', (event, data) => {

        filterObj = data;

        applyFilterToCommonData();

        if (vm.isTotalSpendSelected) {
            applyFilterToSpendsData();
        } else {
            applyFilterToIncomeData();
        }
    })

    /**
     *Apply filteration only for transactions related to spending 
     * 
     */
    function applyFilterToSpendsData() {
        switch (filterObj.account.code) {
            case 'ACAL':
                switch (filterObj.periodOfTime.code) {
                    case 'THM':
                        vm.transactions = vm.myTransactions.allAccount.thisMonth.spends;
                        vm.chartObject = vm.myTransactions.allAccount.thisMonth.spendChartObject;
                        break;
                    case 'LAM':
                        vm.transactions = vm.myTransactions.allAccount.lastMonth.spends;
                        vm.chartObject = vm.myTransactions.allAccount.lastMonth.spendChartObject;
                        break;
                    case 'THQ':
                        vm.transactions = vm.myTransactions.allAccount.thisQuater.spends;
                        vm.chartObject = vm.myTransactions.allAccount.thisQuater.spendChartObject;
                        break;
                    case 'LAQ':
                        vm.transactions = vm.myTransactions.allAccount.lastQuater.spends;
                        vm.chartObject = vm.myTransactions.allAccount.lastQuater.spendChartObject;
                        break;
                    case 'THY':
                        vm.transactions = vm.myTransactions.allAccount.thisYear.spends;
                        vm.chartObject = vm.myTransactions.allAccount.thisYear.spendChartObject;
                        break;
                    case 'LAY':
                        vm.transactions = vm.myTransactions.allAccount.lastYear.spends;
                        vm.chartObject = vm.myTransactions.allAccount.lastYear.spendChartObject;
                        break;
                    case 'CUS':
                        vm.transactions = vm.myTransactions.allAccount.custom.spends;
                        vm.chartObject = vm.myTransactions.allAccount.custom.spendChartObject;
                        break;
                }
                break;

            case 'AC01':
                switch (filterObj.periodOfTime.code) {
                    case 'THM':
                        vm.transactions = vm.myTransactions.accountOne.thisMonth.spends;
                        vm.chartObject = vm.myTransactions.accountOne.thisMonth.spendChartObject;
                        break;
                    case 'LAM':
                        vm.transactions = vm.myTransactions.accountOne.lastMonth.spends;
                        vm.chartObject = vm.myTransactions.accountOne.lastMonth.spendChartObject;
                        break;
                    case 'THQ':
                        vm.transactions = vm.myTransactions.accountOne.thisQuater.spends;
                        vm.chartObject = vm.myTransactions.accountOne.thisQuater.spendChartObject;
                        break;
                    case 'LAQ':
                        vm.transactions = vm.myTransactions.accountOne.lastQuater.spends;
                        vm.chartObject = vm.myTransactions.accountOne.lastQuater.spendChartObject;
                        break;
                    case 'THY':
                        vm.transactions = vm.myTransactions.accountOne.thisYear.spends;
                        vm.chartObject = vm.myTransactions.accountOne.thisYear.spendChartObject;
                        break;
                    case 'LAY':
                        vm.transactions = vm.myTransactions.accountOne.lastYear.spends;
                        vm.chartObject = vm.myTransactions.accountOne.lastYear.spendChartObject;
                        break;
                    case 'CUS':
                        vm.transactions = vm.myTransactions.accountOne.custom.spends;
                        vm.chartObject = vm.myTransactions.accountOne.custom.spendChartObject;
                        break;
                }
                break;

        }
    }

    /**
     * Apply filteration only for transactions related to income 
     * 
     */
    function applyFilterToIncomeData() {
        switch (filterObj.account.code) {
            case 'ACAL':
                switch (filterObj.periodOfTime.code) {
                    case 'THM':
                        vm.transactions = vm.myTransactions.allAccount.thisMonth.incomes;
                        vm.chartObject = vm.myTransactions.allAccount.thisMonth.incomeChartObject;
                        break;
                    case 'LAM':
                        vm.transactions = vm.myTransactions.allAccount.lastMonth.incomes;
                        vm.chartObject = vm.myTransactions.allAccount.lastMonth.incomeChartObject;
                        break;
                    case 'THQ':
                        vm.transactions = vm.myTransactions.allAccount.thisQuater.incomes;
                        vm.chartObject = vm.myTransactions.allAccount.thisQuater.incomeChartObject;
                        break;
                    case 'LAQ':
                        vm.transactions = vm.myTransactions.allAccount.lastQuater.incomes;
                        vm.chartObject = vm.myTransactions.allAccount.lastQuater.incomeChartObject;
                        break;
                    case 'THY':
                        vm.transactions = vm.myTransactions.allAccount.thisYear.incomes;
                        vm.chartObject = vm.myTransactions.allAccount.thisYear.incomeChartObject;
                        break;
                    case 'LAY':
                        vm.transactions = vm.myTransactions.allAccount.lastYear.incomes;
                        vm.chartObject = vm.myTransactions.allAccount.lastYear.incomeChartObject;
                        break;
                    case 'CUS':
                        vm.transactions = vm.myTransactions.allAccount.custom.incomes;
                        vm.chartObject = vm.myTransactions.allAccount.custom.incomeChartObject;
                        break;
                }
                break;

            case 'AC01':
                switch (filterObj.periodOfTime.code) {
                    case 'THM':
                        vm.transactions = vm.myTransactions.accountOne.thisMonth.incomes;
                        vm.chartObject = vm.myTransactions.accountOne.thisMonth.incomeChartObject;
                        break;
                    case 'LAM':
                        vm.transactions = vm.myTransactions.accountOne.lastMonth.incomes;
                        vm.chartObject = vm.myTransactions.accountOne.lastMonth.incomeChartObject;
                        break;
                    case 'THQ':
                        vm.transactions = vm.myTransactions.accountOne.thisQuater.incomes;
                        vm.chartObject = vm.myTransactions.accountOne.thisQuater.incomeChartObject;
                        break;
                    case 'LAQ':
                        vm.transactions = vm.myTransactions.accountOne.lastQuater.incomes;
                        vm.chartObject = vm.myTransactions.accountOne.lastQuater.incomeChartObject;
                        break;
                    case 'THY':
                        vm.transactions = vm.myTransactions.accountOne.thisYear.incomes;
                        vm.chartObject = vm.myTransactions.accountOne.thisYear.incomeChartObject;
                        break;
                    case 'LAY':
                        vm.transactions = vm.myTransactions.accountOne.lastYear.incomes;
                        vm.chartObject = vm.myTransactions.accountOne.lastYear.incomeChartObject;
                        break;
                    case 'CUS':
                        vm.transactions = vm.myTransactions.accountOne.custom.incomes;
                        vm.chartObject = vm.myTransactions.accountOne.custom.incomeChartObject;
                        break;
                }
                break;

        }
    }

    /**
     * Apply filteration for commonly used data
     * 
     */
    function applyFilterToCommonData() {
        switch (filterObj.account.code) {
            case 'ACAL':
                switch (filterObj.periodOfTime.code) {
                    case 'THM':
                        vm.totalSpend = vm.myTransactions.allAccount.thisMonth.totalSpend;
                        vm.totalIncome = vm.myTransactions.allAccount.thisMonth.totalIncome;
                        vm.timePeriod = vm.myTransactions.allAccount.thisMonth.timePeriod;
                        break;
                    case 'LAM':
                        vm.totalSpend = vm.myTransactions.allAccount.lastMonth.totalSpend;
                        vm.totalIncome = vm.myTransactions.allAccount.lastMonth.totalIncome;
                        vm.timePeriod = vm.myTransactions.allAccount.lastMonth.timePeriod;
                        break;
                    case 'THQ':
                        vm.totalSpend = vm.myTransactions.allAccount.thisQuater.totalSpend;
                        vm.totalIncome = vm.myTransactions.allAccount.thisQuater.totalIncome;
                        vm.timePeriod = vm.myTransactions.allAccount.thisQuater.timePeriod;
                        break;
                    case 'LAQ':
                        vm.totalSpend = vm.myTransactions.allAccount.lastQuater.totalSpend;
                        vm.totalIncome = vm.myTransactions.allAccount.lastQuater.totalIncome;
                        vm.timePeriod = vm.myTransactions.allAccount.lastQuater.timePeriod;
                        break;
                    case 'THY':
                        vm.totalSpend = vm.myTransactions.allAccount.thisYear.totalSpend;
                        vm.totalIncome = vm.myTransactions.allAccount.thisYear.totalIncome;
                        vm.timePeriod = vm.myTransactions.allAccount.thisYear.timePeriod;
                        break;
                    case 'LAY':
                        vm.totalSpend = vm.myTransactions.allAccount.lastYear.totalSpend;
                        vm.totalIncome = vm.myTransactions.allAccount.lastYear.totalIncome;
                        vm.timePeriod = vm.myTransactions.allAccount.lastYear.timePeriod;
                        break;
                    case 'CUS':
                        vm.totalSpend = vm.myTransactions.allAccount.custom.totalSpend;
                        vm.totalIncome = vm.myTransactions.allAccount.custom.totalIncome;
                        vm.timePeriod = filterObj.periodOfTime.name;
                        break;
                }
                break;

            case 'AC01':
                switch (filterObj.periodOfTime.code) {
                    case 'THM':
                        vm.totalSpend = vm.myTransactions.accountOne.thisMonth.totalSpend;
                        vm.totalIncome = vm.myTransactions.accountOne.thisMonth.totalIncome;
                        vm.timePeriod = vm.myTransactions.accountOne.thisMonth.timePeriod;
                        break;
                    case 'LAM':
                        vm.totalSpend = vm.myTransactions.accountOne.lastMonth.totalSpend;
                        vm.totalIncome = vm.myTransactions.accountOne.lastMonth.totalIncome;
                        vm.timePeriod = vm.myTransactions.accountOne.lastMonth.timePeriod;
                        break;
                    case 'THQ':
                        vm.totalSpend = vm.myTransactions.accountOne.thisQuater.totalSpend;
                        vm.totalIncome = vm.myTransactions.accountOne.thisQuater.totalIncome;
                        vm.timePeriod = vm.myTransactions.accountOne.thisQuater.timePeriod;
                        break;
                    case 'LAQ':
                        vm.totalSpend = vm.myTransactions.accountOne.lastQuater.totalSpend;
                        vm.totalIncome = vm.myTransactions.accountOne.lastQuater.totalIncome;
                        vm.timePeriod = vm.myTransactions.accountOne.lastQuater.timePeriod;
                        break;
                    case 'THY':
                        vm.totalSpend = vm.myTransactions.accountOne.thisYear.totalSpend;
                        vm.totalIncome = vm.myTransactions.accountOne.thisYear.totalIncome;
                        vm.timePeriod = vm.myTransactions.accountOne.thisYear.timePeriod;
                        break;
                    case 'LAY':
                        vm.totalSpend = vm.myTransactions.accountOne.lastYear.totalSpend;
                        vm.totalIncome = vm.myTransactions.accountOne.lastYear.totalIncome;
                        vm.timePeriod = vm.myTransactions.accountOne.lastYear.timePeriod;
                        break;
                    case 'CUS':
                        vm.totalSpend = vm.myTransactions.accountOne.custom.totalSpend;
                        vm.totalIncome = vm.myTransactions.accountOne.custom.totalIncome;
                        vm.timePeriod = filterObj.periodOfTime.name;
                        break;
                }
                break;

        }
    }

    $scope.$on('$ionicView.beforeEnter', function (e, data) {
        $scope.$root.showMenuIcon = true;
        $scope.$root.showBackIcon = true;
        $scope.$root.menuIconColor = '#0594d9';
    });

    $scope.$on('$ionicView.enter', function () {
        if(isDataLoaded){
            miliuService.preloaderHide();
        }
    });

    $scope.$on('$ionicView.beforeLeave', function () {
        miliuService.preloaderShow();
    });
}