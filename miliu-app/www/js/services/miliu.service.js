(function () {
    'use strict';

    angular
        .module('miliu')
        .factory('miliuService', miliuService);

    miliuService.$inject = ['$http', 'config', '$ionicLoading']
    /**
     * Create miliuService factory
     * 
     * @param {any} $http 
     * @param {any} config 
     * @returns 
     */
    function miliuService($http, config, $ionicLoading) {
        return {
            getGoals: getGoals,
            getSpendDashboardData: getSpendDashboardData,
            getMyTransactions: getMyTransactions,
            myBudget: myBudget,
            getSetAlertData: getSetAlertData,
            getFilterData: getFilterData,
            filterState: null,
            getMyIncomeData: getMyIncomeData,
            getMySepndData: getMySepndData,
            preloaderShow: preloaderShow,
            preloaderHide: preloaderHide

        };
        /**
         * Get Goals from API
         * 
         * @returns 
         */
        function getGoals() {
            return $http.get(config.API + '/goals')
                .then(serviceComplete)
                .catch(serviceError);

        }

        /**
         * Get spend dashboard data
         * 
         * @returns 
         */
        function getSpendDashboardData() {
            return $http.get(config.API + '/spend-dashboard')
                .then(serviceComplete)
                .catch(serviceError);

        }
        /**
         * Get my transactions data
         * 
         * @returns 
         */
        function getMyTransactions() {
            return $http.get(config.API + '/my-transactions')
                .then(serviceComplete)
                .catch(serviceError);
        }
        /**
         * Get my transactions data
         * 
         * @returns 
         */
        function myBudget() {
            return $http.get(config.API + '/my-budget')
                .then(serviceComplete)
                .catch(serviceError);

        }
        /**
        * Get setAlert data
        * 
        * @returns 
        */
        function getSetAlertData() {
            return $http.get(config.API + '/set-alert')
                .then(serviceComplete)
                .catch(serviceError);

        }
        /**
       * Get filter data
       * 
       * @returns 
       */
        function getFilterData() {
            return $http.get(config.API + '/filter')
                .then(serviceComplete)
                .catch(serviceError);

        }

        /**
        * Get myIncome data
        * 
        * @returns 
        */
        function getMyIncomeData() {
            return $http.get(config.API + '/myIncome')
                .then(serviceComplete)
                .catch(serviceError);

        }

        /**
        * Get mySpend data
        * 
        * @returns 
        */
        function getMySepndData() {
            return $http.get(config.API + '/mySpend')
                .then(serviceComplete)
                .catch(serviceError);

        }

        /**
         * Call this function when successfully completed the API call
         * 
         * @param {any} response 
         * @returns 
         */
        function serviceComplete(response) {
            return response.data;
        }

        /**
         * Call this function when completed API call with error
         * 
         * @param {any} error 
         */
        function serviceError(error) {
            //log errors
            console.log(error);
        }

        /**
         * preloader show
         * 
         */
        function preloaderShow() {
            $ionicLoading.show({
                templateUrl: 'templates/preloader.html'
            });
        }
        
        /**
         * preloader hide
         * 
         */
        function preloaderHide() {
            $ionicLoading.hide();
        }
    }
}())