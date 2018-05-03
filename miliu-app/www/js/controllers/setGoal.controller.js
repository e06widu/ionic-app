(function () {
    angular
        .module('miliu')
        .controller('SetGoalController', SetGoalController);
    SetGoalController.$inject = ['$scope', '$ionicHistory', 'miliuService', 'MonthPicker'];
    /**
     * Create SetGoalController
     * 
     * @param {any} $ionicHistory 
     * @param {any} miliuService 
     */
    function SetGoalController($scope, $ionicHistory, miliuService, MonthPicker) {
        var vm = this;
        vm.$onInit = onInit;
        vm.submitted = false;
        vm.categories = [];
        vm.selectedCategory;
        vm.isOpenCategory = false;
        vm.isOpenFundingAccount = false;
        vm.isOpenStartDate = false;

        vm.months = [];
        vm.selectedMonth;

        vm.years = [];


        vm.fundingAccounts = [];
        vm.selectedFundingAccount;


        vm.goalStartDate = getNextMonth();
        var gMonth = vm.goalStartDate.getMonth(); //months from 0-11
        var gDday = vm.goalStartDate.getDate();
        var gYear = vm.goalStartDate.getFullYear();
        vm.selectedYear = { "name": gYear };
        vm.showStartDatePicker = showStartDatePicker;
        vm.onSave = onSave;
        vm.onCancel = onCancel;

        vm.numberOfContribution = 0;
        vm.monthlyContribution = 0;
        vm.calNumberOfContribution = calNumberOfContribution;
        vm.onChangeGoalAmount = onChangeGoalAmount;

        vm.openMonthPicker = openMonthPicker;

        MonthPicker.init({
            maxMonthIndex: 11,
            maxYear: new Date().getFullYear() + 30,
            startingYear: new Date().getFullYear(),
            title: 'Month/Year',
            cancelText: 'SET',
            cancelClass: 'button-positive'
        });

        $scope.pivotYear = 2000;
        $scope.startDate = {
            year: vm.goalStartDate.getFullYear(),
            month: vm.goalStartDate.getMonth() + 1,
            day: vm.goalStartDate.getDate(),
        };

        $scope.getStartDate = function () {
            return new Date($scope.startDate.year + '-'
            + $scope.startDate.month + '-'
            + $scope.startDate.day);
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

        activate();

        function onInit() {
            $scope.showingStDate = true;
        };
        /**
         * Initialize the Set Goals data loading from API
         * 
         * @returns 
         */
        function activate() {
            return getGoals().then(() => {
                //log info if any
            });
        }
        /**
         * Get Set Goals data from the service
         * 
         * @returns 
         */
        function getGoals() {
            miliuService.preloaderShow();
            return miliuService.getGoals()
                .then((data) => {
                    var setGoalData = data.setGoals;

                    vm.categories = setGoalData.categories;
                    vm.selectedCategory = vm.categories[0];

                    vm.months = setGoalData.months;
                    vm.selectedMonth = vm.months[gMonth];

                    //vm.years = setGoalData.years;
                    //var sYear = _.find(vm.years, { 'name': gYear });
                    //vm.selectedYear = sYear ? sYear : vm.years[0];

                    vm.fundingAccounts = setGoalData.fundingAccounts;
                    vm.selectedFundingAccount = vm.fundingAccounts[0];
                    miliuService.preloaderHide();
                    return data;
                }, () => {
                    miliuService.preloaderHide();
                });
        }

        /**
           * Get the next month from the current month
           * 
           * @returns 
           */
        function getNextMonth() {
            var now = new Date();
            var current = new Date();
            if (now.getMonth() == 11) {
                current = new Date(now.getFullYear() + 1, 0, 1);
            } else {
                current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            }

            return current;
        }
        /**
         * get month difference
         * 
         * @param {any} d1 
         * @param {any} d2 
         * @returns 
         */
        function monthDiff(d1, d2) {
            var months;
            months = (d2.getFullYear() - d1.getFullYear()) * 12;
            months -= d1.getMonth() + 1;
            months += d2.getMonth();
            return months <= 0 ? 0 : months;
        }
        /**
         * When change goal ammount caluculate number Of Contribution
         * 
         */
        function onChangeGoalAmount() {
            calNumberOfContribution();
        }
        /**
         * caluculate number Of Contribution
         * 
         */
        function calNumberOfContribution() {
            gMonth = vm.goalStartDate.getUTCMonth(); //months from 0-11
            gDday = vm.goalStartDate.getUTCDate();
            gYear = vm.goalStartDate.getUTCFullYear();

            if (vm.selectedYear && vm.selectedMonth) {
                vm.numberOfContribution = monthDiff(
                    new Date(gYear, gMonth, gDday),
                    new Date(vm.selectedYear.name, vm.selectedMonth.id - 1, gDday)
                )
            }

            var amount = vm.numberOfContribution > 0 ? (vm.goalAmount / vm.numberOfContribution) : vm.goalAmount;
            vm.monthlyContribution = amount ? amount.toFixed(2) : 0;
        }


        function startDateOnSuccess(date) {
            vm.goalStartDate = date;
            $scope.$apply();
            vm.calNumberOfContribution();
        }

        function startDateOnError(error) { // Android only

        }


        function showStartDatePicker() {
            var startDateOptions = {
                date: vm.goalStartDate,
                mode: 'date',
                androidTheme: 3,
                minDate: ionic.Platform.isIOS() ? new Date() : new Date().valueOf(),
            };

            datePicker.show(startDateOptions, startDateOnSuccess, startDateOnError);
        }

        function openMonthPicker() {
            MonthPicker.show(function (res) {
                vm.selectedMonth = res.month ? vm.months[res.month] : vm.selectedMonth;
                vm.selectedYear = res.year ? { "name": res.year } : vm.selectedYear;

                vm.calNumberOfContribution();
            });
        }

        /**
         * navigate back after save set goal
         * 
         */
        function onSave() {
            vm.submitted = true;
            var goalForm = $scope.$$childHead.goalForm;
            if (goalForm.$valid) {
                $ionicHistory.goBack();
            }
        }

        function onCancel() {
            $scope.$$childHead.goalForm.$setPristine();
            $ionicHistory.goBack();
        }



        $scope.$on('$ionicView.beforeEnter', function (e, data) {
            $scope.$root.showMenuIcon = false;
            $scope.$root.$root.showBackIcon = false;
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
