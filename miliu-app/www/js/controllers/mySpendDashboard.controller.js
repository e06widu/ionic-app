angular
    .module('miliu')
    .controller('MySpendDashboardController', MySpendDashboardController);

MySpendDashboardController.$inject = ['$scope', '$state', '$ionicModal', 'miliuService']

function MySpendDashboardController($scope, $state, $ionicModal, miliuService) {
    var vm = this;
    var isDataLoaded = false;
    vm.navigate = navigate;
    vm.getDashboardData = getDashboardData;
    vm.openTellMeWhy = openTellMeWhy;

    vm.dashBoardData = {};
    vm.accounts = [];
    vm.batteryLevel;

    vm.changeSpends = changeSpends;

    getDashboardData();

    function getDashboardData() {
        miliuService.preloaderShow();
        return miliuService.getSpendDashboardData()
            .then(function (data) {
                miliuService.preloaderHide();
                isDataLoaded = true;
                vm.dashBoardData = data;
                vm.accounts = vm.dashBoardData.accounts;
                vm.batteryLevel = vm.dashBoardData.currentSpend.percentage > 0 ? vm.dashBoardData.currentSpend.percentage : 0;
                console.log(vm.dashBoardData);
            }, function () {
                miliuService.preloaderHide();
            });
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

    function openTellMeWhy() {
        $scope.modal.show();
    }

    $ionicModal.fromTemplateUrl('modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function () {
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    // Cleanup the modal when we're done with it!
    //   $scope.$on('$destroy', function() {
    //     $scope.modal.remove();
    //   });
    //   // Execute action on hide modal
    //   $scope.$on('modal.hidden', function() {
    //     // Execute action
    //   });
    //   // Execute action on remove modal
    //   $scope.$on('modal.removed', function() {
    //     // Execute action
    //   });

    function changeSpends(stage) {
        switch (stage) {
            case 'NB':
                vm.dashBoardData.isSetBudget = false;
                vm.dashBoardData.currentSpend.percentage = 100
                break;

            case 'BN':
                vm.dashBoardData.isSetBudget = true;
                vm.dashBoardData.currentSpend.percentage = 75
                break;

            case 'BLE':
                vm.dashBoardData.isSetBudget = true;
                vm.dashBoardData.currentSpend.percentage = 25
                break;

            case 'BE':
                vm.dashBoardData.isSetBudget = true;
                vm.dashBoardData.currentSpend.percentage = -10
                break;
        }

        vm.batteryLevel = vm.dashBoardData.currentSpend.percentage > 0 ? vm.dashBoardData.currentSpend.percentage : 0;

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