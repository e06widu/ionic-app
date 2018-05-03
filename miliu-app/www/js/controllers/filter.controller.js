(function () {
    angular
        .module('miliu')
        .controller('FilterController', FilterController);
    FilterController.$inject = ['$scope', '$state', 'miliuService', '$ionicModal', '$ionicHistory', '$rootScope', '$filter']
    /**
     * Create FilterController
     * 
     * @param {any} $state 
     * @param {any} miliuService 
     */
    function FilterController($scope, $state, miliuService, $ionicModal, $ionicHistory, $rootScope, $filter) {
        var vm = this;
        vm.$onInit = onInit;
        var endMinDate = new Date();
        var oldSelectedTimePeriod;
        var selectedCustomTimePeriod;
        vm.accounts = [];
        vm.selectedAccount;
        vm.isOpenAccouts = false;
        vm.showingStDate = false;
        vm.showingEndDate = false;

        vm.periodOfTimes = [];
        vm.selectedPeriodOfTime = { name: '' };
        vm.isOpenPeriodOfTimes = false;

        vm.onCustomPeriodOfTimeSelect = onCustomPeriodOfTimeSelect;

        vm.startDate = new Date();
        vm.endDate = new Date();
        vm.onCancelCustomPeriodOfTime = onCancelCustomPeriodOfTime;
        vm.onSaveCustomPeriodOfTime = onSaveCustomPeriodOfTime;
        vm.onSelectPeriodOfTime = onSelectPeriodOfTime;
        vm.showStartDatePicker = showStartDatePicker;
        vm.showEndDatePicker = showEndDatePicker;
        vm.isSelectStartDate = false;
        vm.applyFilter = applyFilter;

        $scope.displayStartDate = function () {
            $scope.showingStDate = !$scope.showingStDate;
            $scope.showingEndDate = false;
        }
        $scope.displayEndDate = function () {
            $scope.showingStDate = false;
            $scope.showingEndDate = !$scope.showingEndDate;
        }


        $scope.pivotYear = 2000;
        $scope.startDate = {
            year: vm.startDate.getFullYear(),
            month: vm.startDate.getMonth() + 1,
            day: vm.startDate.getDate(),
        };

        $scope.getStartDate = function () {
            return new Date($scope.startDate.year + '-'
                + $scope.startDate.month + '-'
                + $scope.startDate.day);
        }

        $scope.endDate = {
            year: vm.startDate.getFullYear(),
            month: vm.startDate.getMonth() + 1,
            day: vm.startDate.getDate()
        };

        $scope.getEndDate = function () {
            return new Date($scope.endDate.year + '-'
                + $scope.endDate.month + '-'
                + $scope.endDate.day);
        }


        $scope.attachment = "inline";
        $scope.bindHtml = "true";
        var years = [];
        $scope.getYears = function () {
            return years;
        };
        $scope.$watch('pivotYear', function (year) {
            years = [];
            for (var i = 0; i < 100; i++) {
                years.push(year + i);
            }
        });
        $scope.getDays = function (year, month) {
            var result = [];
            for (var i = 1; i < 30; i++) {
                result.push(i);
            }
            return result;
        };



        getFilterData();

        function onInit() {
            $scope.showingStDate = true;
            $scope.showingEndDate = false;
        }
        /**
         * Get Filter related data
         * 
         * @returns 
         */
        function getFilterData() {
            miliuService.preloaderShow();
            return miliuService.getFilterData()
                .then(function (data) {
                    vm.accounts = data.accounts;
                    vm.periodOfTimes = data.periodOfTimes;

                    if (miliuService.filterState) {
                        vm.selectedAccount = miliuService.filterState.account;
                        vm.selectedPeriodOfTime = miliuService.filterState.periodOfTime;
                        oldSelectedTimePeriod = miliuService.filterState.periodOfTime;
                    } else {
                        vm.selectedAccount = vm.accounts[0];
                        vm.selectedPeriodOfTime = vm.periodOfTimes[0];
                        oldSelectedTimePeriod = vm.periodOfTimes[0];
                    }
                    miliuService.preloaderHide();
                }, function () {
                    miliuService.preloaderHide();
                });
        }

        function startDateOnSuccess(date) {
            vm.startDate = date;
            endMinDate = date;
            vm.endDate = endMinDate
            vm.isSelectStartDate = true;
            $scope.$apply();
            //showEndDatePicker();
        }

        function startDateOnError(error) { // Android only

        }


        function endDateOnSuccess(date) {
            vm.endDate = date;
            vm.isSelectStartDate = false;
            $scope.$apply();


        }

        function endDateOnError(error) { // Android only

        }

        function showStartDatePicker() {
            var startDateOptions = {
                date: vm.startDate,
                mode: 'date',
                androidTheme: 3,
                titleText: "START DATE"
            };

            datePicker.show(startDateOptions, startDateOnSuccess, startDateOnError);
        }

        function showEndDatePicker() {

            var endDateOptions = {
                date: endMinDate,
                mode: 'date',
                minDate: ionic.Platform.isIOS() ? endMinDate : endMinDate.valueOf(),
                androidTheme: 3,
                titleText: "END DATE"
            };

            datePicker.show(endDateOptions, endDateOnSuccess, endDateOnError);
        }

        /**
         * Open Custom Period Of Time selection modal
         * 
         */
        function onCustomPeriodOfTimeSelect() {
            $scope.openCustomPeriodOfTimeModal();
        }

        $ionicModal.fromTemplateUrl('customPeriodOfTimeModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.customPeriodOfTimeModal = modal;

        });
        $scope.openCustomPeriodOfTimeModal = function () {
            $scope.customPeriodOfTimeModal.show();
            $scope.showingStDate = true;
            $scope.showingEndDate = false;
        };
        $scope.closeCustomPeriodOfTimeModal = function () {
            $scope.customPeriodOfTimeModal.hide();
        };

        function onCancelCustomPeriodOfTime() {
            $scope.closeCustomPeriodOfTimeModal();
        }

        function onSaveCustomPeriodOfTime() {
            $scope.closeCustomPeriodOfTimeModal();
            var cusTimeOfPeriod = $filter('date')($scope.getStartDate(), 'dd MMM, yyyy') + ' - ' + $filter('date')($scope.getEndDate(), 'dd MMM, yyyy');
            vm.selectedPeriodOfTime = selectedCustomTimePeriod;
            vm.selectedPeriodOfTime.name = cusTimeOfPeriod;
        }

        function onSelectPeriodOfTime(periodOfTime) {
            if (periodOfTime.code == 'CUS') {
                selectedCustomTimePeriod = periodOfTime;
                vm.selectedPeriodOfTime = oldSelectedTimePeriod;
                $scope.openCustomPeriodOfTimeModal();
            }
        }

        /**
         * Apply filter to My Transaction view
         * 
         */
        function applyFilter() {
            var filterObj = {
                account: vm.selectedAccount,
                periodOfTime: vm.selectedPeriodOfTime
            }

            var today = new Date();
            var startDate = today;
            var endDate = today;

            switch (filterObj.periodOfTime.code) {
                case 'THM':
                    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                    endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                    break;
                case 'LAM':
                    startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                    endDate = new Date(today.getFullYear(), today.getMonth(), 0);
                    break;
                case 'THQ':
                    startDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
                    endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                    break;
                case 'LAQ':
                    startDate = new Date(today.getFullYear(), today.getMonth() - 7, 1);
                    endDate = new Date(today.getFullYear(), today.getMonth() - 3, 0);
                    break;
                case 'THY':
                    startDate = new Date(today.getFullYear(), 0, 1);
                    endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                    break;
                case 'LAY':
                    startDate = new Date(today.getFullYear() - 1, 0, 1);
                    endDate = new Date(today.getFullYear() - 1, 12, 0);
                    break;
                case 'CUS':
                    startDate = $scope.getStartDate();
                    endDate = $scope.getEndDate();

                    break;

            }

            filterObj.periodOfTime.startDate = startDate;
            filterObj.periodOfTime.endDate = endDate;

            miliuService.filterState = filterObj;

            $ionicHistory.goBack();
            $rootScope.$broadcast('applyFilter', filterObj);
        }

        $scope.$on('$ionicView.beforeEnter', function (e, data) {
            $scope.$root.showMenuIcon = true;
            $scope.$root.showBackIcon = true;
            $scope.$root.menuIconColor = '#0594d9';
        });

        $scope.$on('$ionicView.beforeLeave', function () {
            miliuService.preloaderShow();
        });
    
        $scope.$on('$ionicView.afterLeave', function () {
            miliuService.preloaderHide();
        });

    }
}())
