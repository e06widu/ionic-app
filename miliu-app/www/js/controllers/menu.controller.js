(function () {
    'use strict';
    angular
        .module('miliu')
        .controller('MenuController', MenuController);
    MenuController.$inject = ['$scope', 'miliuService', '$state', '$ionicSideMenuDelegate'];

    /**
     * Create MenuController
     *
     * @param {any} $scope
     * @param {any} miliuService
     * @param {any} $state
     */
    function MenuController($scope, miliuService, $state, $ionicSideMenuDelegate) {
        var menu = this;
        var selectedMenuIcon;
        menu.menuItems = getMenuItems();
        menu.onSelectMenuItem = onSelectMenuItem;
        menu.notificationCount = 2;

        $scope.isMenuOpen = function () {
            return $ionicSideMenuDelegate.isOpen();
        };

        /**
         * Highlight and change the navigation according to navigation
         *
         * @param {any} menuItem
         */
        function onSelectMenuItem(menuItem) {
            menuItem.isSelected = true;

            if (selectedMenuIcon) {
                selectedMenuIcon.isSelected = false;
            }

            menuItem.isSelected = menuItem.title.toLowerCase() == 'logout' ? false : menuItem.isSelected;
            selectedMenuIcon = menuItem;

            $state.go(menuItem.state);
        }

        /**
         * Get Menu items
         *
         * @returns
         */
        function getMenuItems() {
            return [
                {
                    id: 1,
                    title: 'Money Management',
                    state: 'app.landing',
                    icon: 'money-management-icon',
                    isSelected: false
                },
                {
                    id: 2,
                    title: 'Money Movement',
                    state: 'app.landing',
                    icon: 'money-movement-icon',
                    isSelected: false
                },
                {
                    id: 3,
                    title: 'Fund My Purchase',
                    state: 'app.landing',
                    icon: 'fund-my-purchases-icon',
                    isSelected: false
                },
                {
                    id: 4,
                    title: 'Notifications',
                    state: 'app.landing',
                    icon: 'notification-icon',
                    isSelected: false
                },
                {
                    id: 5,
                    title: 'Talk to miliu',
                    state: 'app.landing',
                    icon: 'talk-to-miliu-icon',
                    isSelected: false
                },
                {
                    id: 6,
                    title: 'Settings',
                    state: 'app.landing',
                    icon: 'settings-icon',
                    isSelected: false
                },
                {
                    id: 7,
                    title: 'Logout',
                    state: 'app.landing',
                    icon: 'logout-icon',
                    isSelected: false
                }
            ];
        }
    }
}())
