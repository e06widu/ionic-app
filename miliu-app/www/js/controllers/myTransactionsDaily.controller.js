(function () {
    angular
        .module('miliu')
        .controller('MyTransactionsDailyController', MyTransactionsDailyController);
    MyTransactionsDailyController.$inject = ['$state', 'miliuService', '$rootScope', '$filter', '$scope']
    /**
     * Create MyTransactionsDailyController
     *
     * @param {any} $state
     * @param {any} miliuService
     * @param {any} $rootScope
     */
    function MyTransactionsDailyController($state, miliuService, $rootScope, $filter, $scope) {
        var vm = this;
        var filterObj = miliuService.filterState;
        var today = new Date();
        var isDataLoaded = false;
        var myTransactionData;
        vm.onSwipeRight = onSwipeRight;
        vm.navigate = navigate;

        vm.myTransactions = {};
        vm.totalIncome = 0;
        vm.totalSpend = 0;
        vm.timePeriod = '';

        getMyTransactions();
        /**
         * Get My Transaction data
         *
         * @returns
         */
        function getMyTransactions() {
            miliuService.preloaderShow();
            return miliuService.getMyTransactions()
                .then(function (data) {
                    isDataLoaded = true;
                    myTransactionData = data;
                    //console.log(myTransactionData);
                    setupDailyTransactionData();
                    miliuService.preloaderHide();
                }, function () {
                    miliuService.preloaderHide();
                });
        }

        function setupDailyTransactionData() {
            if (!filterObj) {
                vm.myTransactions = myTransactionData.allAccount.thisMonth.dailyTransActions;
                vm.totalIncome = myTransactionData.allAccount.thisMonth.totalIncome;
                vm.totalSpend = myTransactionData.allAccount.thisMonth.totalSpend;
                vm.timePeriod = myTransactionData.allAccount.thisMonth.timePeriod;

                var periodOfTime =
                    {
                        startDate: new Date(today.getFullYear(), today.getMonth(), 1),
                        endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0)
                    };

                setDisplayTimePeriod(periodOfTime);

            } else {
                //Apply filter if any
                applyFilter();
                setDisplayTimePeriod(filterObj.periodOfTime);
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

        function setDisplayTimePeriod(periodOfTime) {
            vm.timePeriod = $filter('date')(periodOfTime.startDate, 'd') + ' - ' +
                $filter('date')(periodOfTime.endDate, 'd MMM, yyyy');
        }

        /**
         * Do swapping the view
         *
         */
        function onSwipeRight() {
            $state.go('app.myTransactions');
        }

        /**
          * Listening to the filteration change event
          *
          */
        $rootScope.$on('applyFilter', (event, data) => {
            filterObj = data;
            applyFilter();
        })

        vm.toggleTransactionType = function(type) {

            vm['hide' + type + 'Transactions'] = !vm['hide' + type + 'Transactions'];

            // If both are now deactivated, reactivate the other type
            if (vm.hideSpendTransactions && vm.hideIncomeTransactions) {
              vm.hideSpendTransactions = false;
              vm.hideIncomeTransactions = false;
              vm['hide' + type + 'Transactions'] = !vm['hide' + type + 'Transactions'];
            }

            vm.myTransactions.forEach(function(transaction) {
                transaction.hidden = transaction.items.filter(function(item) {
                    return vm['hide' + item.type + 'Transactions'] !== true;
                }).length === 0;
            })

        }

        /**
         * Apply filteration to daily transactions
         *
         */
        function applyFilter() {
            switch (filterObj.account.code) {
                case 'ACAL':
                    switch (filterObj.periodOfTime.code) {
                        case 'THM':
                            vm.myTransactions = myTransactionData.allAccount.thisMonth.dailyTransActions;
                            vm.totalIncome = myTransactionData.allAccount.thisMonth.totalIncome;
                            vm.totalSpend = myTransactionData.allAccount.thisMonth.totalSpend;
                            vm.timePeriod = myTransactionData.allAccount.thisMonth.timePeriod;
                            break;
                        case 'LAM':
                            vm.myTransactions = myTransactionData.allAccount.lastMonth.dailyTransActions;
                            vm.totalIncome = myTransactionData.allAccount.lastMonth.totalIncome;
                            vm.totalSpend = myTransactionData.allAccount.lastMonth.totalSpend;
                            vm.timePeriod = myTransactionData.allAccount.lastMonth.timePeriod;
                            break;
                        case 'THQ':
                            vm.myTransactions = myTransactionData.allAccount.thisQuater.dailyTransActions;
                            vm.totalIncome = myTransactionData.allAccount.thisQuater.totalIncome;
                            vm.totalSpend = myTransactionData.allAccount.thisQuater.totalSpend;
                            vm.timePeriod = myTransactionData.allAccount.thisQuater.timePeriod;
                            break;
                        case 'LAQ':
                            vm.myTransactions = myTransactionData.allAccount.lastQuater.dailyTransActions;
                            vm.totalIncome = myTransactionData.allAccount.lastQuater.totalIncome;
                            vm.totalSpend = myTransactionData.allAccount.lastQuater.totalSpend;
                            vm.timePeriod = myTransactionData.allAccount.lastQuater.timePeriod;
                            break;
                        case 'THY':
                            vm.myTransactions = myTransactionData.allAccount.thisYear.dailyTransActions;
                            vm.totalIncome = myTransactionData.allAccount.thisYear.totalIncome;
                            vm.totalSpend = myTransactionData.allAccount.thisYear.totalSpend;
                            vm.timePeriod = myTransactionData.allAccount.thisYear.timePeriod;
                            break;
                        case 'LAY':
                            vm.myTransactions = myTransactionData.allAccount.lastYear.dailyTransActions;
                            vm.totalIncome = myTransactionData.allAccount.lastYear.totalIncome;
                            vm.totalSpend = myTransactionData.allAccount.lastYear.totalSpend;
                            vm.timePeriod = myTransactionData.allAccount.lastYear.timePeriod;
                            break;
                        case 'CUS':
                            vm.myTransactions = myTransactionData.allAccount.custom.dailyTransActions;
                            vm.totalIncome = myTransactionData.allAccount.custom.totalIncome;
                            vm.totalSpend = myTransactionData.allAccount.custom.totalSpend;
                            vm.timePeriod = filterObj.periodOfTime.name;
                            break;
                    }
                    break;

                case 'AC01':
                    switch (filterObj.periodOfTime.code) {
                        case 'THM':
                            vm.myTransactions = myTransactionData.accountOne.thisMonth.dailyTransActions;
                            vm.totalIncome = myTransactionData.accountOne.thisMonth.totalIncome;
                            vm.totalSpend = myTransactionData.accountOne.thisMonth.totalSpend;
                            vm.timePeriod = myTransactionData.accountOne.thisMonth.timePeriod;
                            break;
                        case 'LAM':
                            vm.myTransactions = myTransactionData.accountOne.lastMonth.dailyTransActions;
                            vm.totalIncome = myTransactionData.accountOne.lastMonth.totalIncome;
                            vm.totalSpend = myTransactionData.accountOne.lastMonth.totalSpend;
                            vm.timePeriod = myTransactionData.accountOne.lastMonth.timePeriod;
                            break;
                        case 'THQ':
                            vm.myTransactions = myTransactionData.accountOne.thisQuater.dailyTransActions;
                            vm.totalIncome = myTransactionData.accountOne.thisQuater.totalIncome;
                            vm.totalSpend = myTransactionData.accountOne.thisQuater.totalSpend;
                            vm.timePeriod = myTransactionData.accountOne.thisQuater.timePeriod;
                            break;
                        case 'LAQ':
                            vm.myTransactions = myTransactionData.accountOne.lastQuater.dailyTransActions;
                            vm.totalIncome = myTransactionData.accountOne.lastQuater.totalIncome;
                            vm.totalSpend = myTransactionData.accountOne.lastQuater.totalSpend;
                            vm.timePeriod = myTransactionData.accountOne.lastQuater.timePeriod;
                            break;
                        case 'THY':
                            vm.myTransactions = myTransactionData.accountOne.thisYear.dailyTransActions;
                            vm.totalIncome = myTransactionData.accountOne.thisYear.totalIncome;
                            vm.totalSpend = myTransactionData.accountOne.thisYear.totalSpend;
                            vm.timePeriod = myTransactionData.accountOne.thisYear.timePeriod;
                            break;
                        case 'LAY':
                            vm.myTransactions = myTransactionData.accountOne.lastYear.dailyTransActions;
                            vm.totalIncome = myTransactionData.accountOne.lastYear.totalIncome;
                            vm.totalSpend = myTransactionData.accountOne.lastYear.totalSpend;
                            vm.timePeriod = myTransactionData.accountOne.lastYear.timePeriod;
                            break;
                        case 'CUS':
                            vm.myTransactions = myTransactionData.accountOne.custom.dailyTransActions;
                            vm.totalIncome = myTransactionData.accountOne.custom.totalIncome;
                            vm.totalSpend = myTransactionData.accountOne.custom.totalSpend;
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
}())
