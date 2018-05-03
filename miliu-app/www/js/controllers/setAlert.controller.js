(function () {
    'use strict';
    angular
        .module('miliu')
        .controller('SetAlertController', SetAlertController);

    /**
     * Create SetAlertController
     * 
     * @param {any} miliuService 
     * @param {any} $ionicHistory 
     */
    function SetAlertController(miliuService, $ionicHistory, $scope) {
        var vm = this;
        vm.openMySpent = openMySpent;
        vm.openCategory = openCategory;

        vm.isOpenedMySpend = false;
        vm.isOpenedCategory = false;

        vm.budgetHeads = [];
        vm.selectedBudgetHead;
        vm.selectedCategory;

        vm.slider = {
            value: 0,
            options: {
                showSelectionBar: true,
                getSelectionBarColor: () => '#fc9504',
                getPointerColor: () => 'gray',
                floor: 0,
                ceil: 100,
                hidePointerLabels: true,
                hideLimitLabels: true
            }
        };

        vm.onSave = onSave;

        activate();
        /**
         * Initialize the budget heads data loading from API
         * 
         * @returns 
         */
        function activate() {
            return getBudgetHeads().then(() => {
                //log info if any
            });
        }
        /**
         * Get budget heads data from the service
         * 
         * @returns 
         */
        function getBudgetHeads() {
            miliuService.preloaderShow();
            return miliuService.getSetAlertData()
                .then((data) => {
                    vm.budgetHeads = data.budgetHeads;
                    vm.selectedBudgetHead = vm.budgetHeads[0];
                    vm.selectedCategory = vm.selectedBudgetHead.categories[0];
                    miliuService.preloaderHide();
                    return data;
                }, () => {
                    miliuService.preloaderHide();
                });
        }
        /**
         * Open My Spent
         * 
         */
        function openMySpent() {
            vm.isOpenedMySpend = !vm.isOpenedMySpend;
        }
        /**
         * Open Category
         * 
         */
        function openCategory() {
            vm.isOpenedCategory = vm.selectedBudgetHead.name == 'Overall' ? false : !vm.isOpenedCategory;
        }
        /**
         * Save set Alert
         * 
         */
        function onSave() {
            $ionicHistory.goBack();
        }

        $scope.$on('$ionicView.beforeEnter', function (e, data) {
            $scope.$root.showMenuIcon = false;
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
