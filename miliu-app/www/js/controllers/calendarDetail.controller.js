angular
    .module('miliu')
    .controller('calendarDetailCtrl', CalendarDetailController);

CalendarDetailController.$inject = ['$state', 'miliuService']

function CalendarDetailController($state, miliuService) {
    var vm = this;
    vm.navigate = navigate;

    /**
     * Navigate clicking on button
     * 
     * @param {any} state - state of the page
     */
    function navigate(state) {
        console.log(state);
        $state.go(state)
    }

}