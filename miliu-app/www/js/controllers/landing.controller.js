
angular
    .module('miliu')
    .controller('LandingController', LandingController);

    LandingController.$inject = ['$state', '$scope', '$localStorage', '$rootScope', '$ionicScrollDelegate','$ionicSideMenuDelegate','miliuService']

function LandingController($state, $scope, $localStorage, $rootScope, $ionicScrollDelegate, $ionicSideMenuDelegate,miliuService) {
    var vm = this;

    vm.navigate = navigate;
    vm.holdItem = holdItem;
    vm.onDropComplete = onDropComplete;

    if ($localStorage.moneyManagmentGridItems) {
        vm.moneyManagmentGridItems = $localStorage.moneyManagmentGridItems
    } else {
        vm.moneyManagmentGridItems = [
            { name: 'My Budget', icon: 'img/money-bag.png', isActive: true, navigate: 'app.myBudget' },
            { name: 'My Goals', icon: 'img/christmas-star.png', isActive: true, navigate: 'app.goals' },
            { name: 'My Dashboard', icon: 'img/dashboard.png', isActive: true, navigate: 'app.mySpendDashboard' },
            { name: 'My Advice', icon: 'img/advice.png', isActive: false, navigate: '' },
            { name: 'My Spend', icon: 'img/buying.png', isActive: false, navigate: '' },
            { name: 'My growth', icon: 'img/increase.png', isActive: false, navigate: '' },
            { name: 'My Borrowings', icon: 'img/receive-cash.png', isActive: false, navigate: '' },
            { name: 'My Protection', icon: 'img/protect.png', isActive: false, navigate: '' }
        ];
    }



    /**
     * Navigate clicking on menu
     * 
     * @param {any} state - state of the page
     */
    function navigate(state) {
        if (state && state.length > 0) {
            $state.go(state)
        }
    }

    /**
     * Hold on the menu item
     * 
     */
    function holdItem() {

    }

    /**
     * This is firing after drag and drop money managment grid item
     * 
     * @param {any} index 
     * @param {any} obj 
     * @param {any} evt 
     */
    function onDropComplete(index, obj, evt) {
        $ionicScrollDelegate.freezeScroll(false);
        var otherObj = vm.moneyManagmentGridItems[index];
        var otherIndex = vm.moneyManagmentGridItems.indexOf(obj);
        vm.moneyManagmentGridItems[index] = obj;
        vm.moneyManagmentGridItems[otherIndex] = otherObj;

        $localStorage.moneyManagmentGridItems = vm.moneyManagmentGridItems;
    }

    /**
     * Listening to drag start event
     * 
     */
    $rootScope.$on('draggable:start', (data) => {
        $ionicScrollDelegate.freezeScroll(true);
        //$ionicSideMenuDelegate.canDragContent(false);
    });

    /**
     * Listening to drag end event
     * 
     */
    $rootScope.$on('draggable:end', (data) =>{
        $ionicScrollDelegate.freezeScroll(false);
        //$ionicSideMenuDelegate.canDragContent(true);
    });

    $scope.$on('$ionicView.beforeEnter', function (e, data) {      
            $scope.$root.showMenuIcon = true;
            $scope.$root.showBackIcon = true;
            $scope.$root.menuIconColor = 'white';
    });

    $scope.$on('$ionicView.enter', function () {
        miliuService.preloaderHide();
    });

    $scope.$on('$ionicView.beforeLeave', function () {
        miliuService.preloaderShow();
    });
}
