(function () {
    'use strict';
    angular
        .module('miliu')
        .controller('GoalsController', GoalsController);
    GoalsController.$inject = ['$scope', 'miliuService', '$state', '$ionicListDelegate', '$timeout'];
    /**
     * Create GoalsController
     * 
     * @param {any} $scope 
     * @param {any} miliuService 
     * @param {any} $state 
     */
    function GoalsController($scope, miliuService, $state, $ionicListDelegate, $timeout) {
        var vm = this;
        var isDataLoaded = false;

        vm.goals = [];
        vm.onSetGoal = onSetGoal;
        vm.stopSwipeOptionButton = stopSwipeOptionButton;
        vm.stopSwipe = false;

        activate();
        /**
         * Initialize the Goals data loading from API
         * 
         * @returns 
         */
        function activate() {
            return getGoals().then(() => {
                //log info if any
            });
        }
        /**
         * Get Goals data from the service
         * 
         * @returns 
         */
        function getGoals() {
            miliuService.preloaderShow();
            return miliuService.getGoals()
                .then((data) => {
                    isDataLoaded = true;
                    vm.goals = data.myGoals;
                    miliuService.preloaderHide();
                    return data;
                }, () => {
                    miliuService.preloaderHide();
                });
        }

        /**
         * navigate to "Set Goal screen"
         * 
         */
        function onSetGoal() {
            $state.go('app.setGoal');
        }

        function stopSwipeOptionButton(stopSwipe) {
            vm.stopSwipe = stopSwipe;
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

    }
}())
