angular
    .module('miliu')
    .controller('CalendarController', CalendarController);

CalendarController.$inject = ['$scope', '$state', '$ionicModal', 'miliuService', 'moment']

function CalendarController($scope, $state, $ionicModal, miliuService, moment) {
    var vm = this;
    vm.navigate = navigate;
    vm.isSelectedMonth = isSelectedMonth;
    vm.selectDate = selectDate;
    vm.prevMonth = prevMonth;
    vm.nextMonth = nextMonth;
    vm.prevYear = prevYear;
    vm.nextYear = nextYear;
    vm.generateCalendar = generateCalendar;
    vm.selectedDate;

    vm.currentDate = new moment();
    vm.nextMonthName = '';
    vm.lastWeek = {};
    vm.transactions = [];

    vm.dayNames = [
        { id: 1, name: 'S' },
        { id: 2, name: 'M' },
        { id: 3, name: 'T' },
        { id: 4, name: 'W' },
        { id: 5, name: 'T' },
        { id: 6, name: 'F' },
        { id: 7, name: 'S' }
    ];
    vm.weeks = [];

    vm.eventDates = [

        {
            mDate: new Date('2018/2/5'),
            events: [
                {
                    value: 200,
                    type: 'INCOME',
                    items: [
                        {
                            icon: 'fa fa-money',
                            color: '#886aea',
                            name: 'Salary',
                            description: 'Office',
                            value: 100
                        },
                        {
                            icon: 'fa fa-codepen',
                            color: '#33cd5f',
                            name: 'Other',
                            description: 'coding',
                            value: 100
                        }
                    ]
                },
                {
                    value: 300,
                    type: 'SPEND',
                    items: [
                        {
                            icon: 'fa fa-taxi',
                            color: '#886aea',
                            name: 'Taxi',
                            description: 'class',
                            value: 100
                        },
                        {
                            icon: 'fa-shopping-bag',
                            color: '#ffc900',
                            name: 'Shoping',
                            description: 'Girl',
                            value: 150
                        },
                        {
                            icon: 'fa fa-cutlery',
                            color: '#11c1f3',
                            name: 'Food',
                            description: 'Dinner',
                            value: 50
                        }
                    ]
                }
            ]
        },
        {
            mDate: new Date('2018/1/18'),
            events: [{
                value: 450,
                type: 'SPEND',
                items: [
                    {
                        icon: 'fa fa-cutlery',
                        name: 'Food',
                        color: '#11c1f3',
                        description: 'Lunch',
                        value: 100
                    },
                    {
                        icon: 'fa fa-book',
                        name: 'Books',
                        color: '#ffc900',
                        description: 'New',
                        value: 150
                    },
                    {
                        icon: 'fa fa-taxi',
                        name: 'Taxi',
                        color: '#886aea',
                        description: 'Home',
                        value: 200
                    }
                ]
            }]
        },
        {
            mDate: new Date('2018/2/18'),
            events: [
                {
                    value: 200,
                    type: 'INCOME',
                    items: [
                        {
                            icon: 'fa fa-money',
                            color: '#886aea',
                            name: 'Salary',
                            description: 'Office',
                            value: 100
                        },
                        {
                            icon: 'fa fa-codepen',
                            color: '#33cd5f',
                            name: 'Other',
                            description: 'coding',
                            value: 100
                        }
                    ]
                },
                {
                    value: 250,
                    type: 'SPEND',
                    items: [
                        {
                            icon: 'fa fa-cutlery',
                            name: 'Food',
                            color: '#11c1f3',
                            description: 'Lunch',
                            value: 100
                        },
                        {
                            icon: 'fa fa-book',
                            name: 'Books',
                            color: '#ffc900',
                            description: 'New',
                            value: 150
                        },
                        {
                            icon: 'fa fa-taxi',
                            name: 'Taxi',
                            color: '#886aea',
                            description: 'Home',
                            value: 200
                        }
                    ]
                }
            ]
        },
        {
            mDate: new Date('2018/3/5'),
            events: [
                {
                    value: 550,
                    type: 'INCOME',
                    items: [
                        {
                            icon: 'fa fa-cutlery',
                            name: 'Food',
                            color: '#11c1f3',
                            description: 'Lunch',
                            value: 100
                        },
                        {
                            icon: 'fa fa-book',
                            name: 'Books',
                            color: '#ffc900',
                            description: 'New',
                            value: 150
                        },
                        {
                            icon: 'fa fa-taxi',
                            name: 'Taxi',
                            color: '#886aea',
                            description: 'Home',
                            value: 200
                        }
                    ]
                }
            ]
        },
        {
            mDate: new Date('2018/2/15'),
            events: [{
                value: 450,
                type: 'SPEND',
                items: [
                    {
                        icon: 'fa fa-cutlery',
                        name: 'Food',
                        color: '#11c1f3',
                        description: 'Lunch',
                        value: 100
                    },
                    {
                        icon: 'fa fa-book',
                        name: 'Books',
                        color: '#ffc900',
                        description: 'New',
                        value: 150
                    },
                    {
                        icon: 'fa fa-taxi',
                        name: 'Taxi',
                        color: '#886aea',
                        description: 'Home',
                        value: 200
                    }
                ]
            }]
        },
        {
            mDate: new Date('2018/3/8'),
            events: [
                {
                    value: 200,
                    type: 'INCOME',
                    items: [
                        {
                            icon: 'fa fa-money',
                            color: '#886aea',
                            name: 'Salary',
                            description: 'Office',
                            value: 100
                        },
                        {
                            icon: 'fa fa-codepen',
                            color: '#33cd5f',
                            name: 'Other',
                            description: 'coding',
                            value: 100
                        }
                    ]
                }, {
                    value: 450,
                    type: 'SPEND',
                    items: [
                        {
                            icon: 'fa fa-cutlery',
                            name: 'Food',
                            color: '#11c1f3',
                            description: 'Lunch',
                            value: 100
                        },
                        {
                            icon: 'fa fa-book',
                            name: 'Books',
                            color: '#ffc900',
                            description: 'New',
                            value: 150
                        },
                        {
                            icon: 'fa fa-taxi',
                            name: 'Taxi',
                            color: '#886aea',
                            description: 'Home',
                            value: 200
                        }
                    ]
                }]
        },
        {
            mDate: new Date('2017/12/8'),
            events: [{
                value: 450,
                type: 'SPEND',
                items: [
                    {
                        icon: 'fa fa-cutlery',
                        name: 'Food',
                        color: '#11c1f3',
                        description: 'Lunch',
                        value: 100
                    },
                    {
                        icon: 'fa fa-book',
                        name: 'Books',
                        color: '#ffc900',
                        description: 'New',
                        value: 150
                    },
                    {
                        icon: 'fa fa-taxi',
                        name: 'Taxi',
                        color: '#886aea',
                        description: 'Home',
                        value: 200
                    }
                ]
            }]
        },
    ];

    generateCalendar();
    getNextMonthName();

    // generate the calendar grid
    function generateCalendar() {
        const dates = fillDates(vm.currentDate);
        const weeks = [];
        while (dates.length > 0) {
            weeks.push(dates.splice(0, 7));
        }
        vm.weeks = weeks;
        vm.lastWeek = vm.weeks[vm.weeks.length - 1];
    }

    // generate dates with data
    function fillDates(currentMoment) {
        var firstOfMonth = moment(currentMoment).startOf('month').day();
        var firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
        var start = firstDayOfGrid.date();

        return _.range(start, start + 35)
            .map((date) => {
                var d = moment(firstDayOfGrid).date(date);
                let events;
                if (isSelected(d)) {
                    events = getEventDetail(d);
                }
                return {
                    today: isToday(d),
                    selected: isSelected(d),
                    mDate: d,
                    events: events
                };
            });
    }

    // date checkers
    function isToday(date) {
        return moment().isSame(moment(date), 'day');
    }

    function isSelected(date) {
        return _.findIndex(vm.eventDates, (selectedDate) => {
            return moment(date).isSame(selectedDate.mDate, 'day');
        }) > -1;
    }

    function getEventDetail(date) {
        return _.find(vm.eventDates, (selectedDate) => {
            if (moment(date).isSame(selectedDate.mDate, 'day')) {
                console.log(selectedDate.events);
                return selectedDate;
            }
        }).events;
    }

    // actions from calendar
    function prevMonth() {
        vm.currentDate = moment(vm.currentDate).subtract(1, 'months');
        vm.generateCalendar();
        getNextMonthName();
    }

    function nextMonth() {
        vm.currentDate = moment(vm.currentDate).add(1, 'months');
        vm.generateCalendar();
        getNextMonthName();
    }

    function getNextMonthName() {
        vm.nextMonthName = moment(vm.currentDate).add(1, 'months');
        console.log(vm.nextMonthName)
    }

    function firstMonth() {
        vm.currentDate = moment(vm.currentDate).startOf('year');
        vm.generateCalendar();
    }

    function lastMonth() {
        vm.currentDate = moment(vm.currentDate).endOf('year');
        vm.generateCalendar();
    }

    function prevYear() {
        vm.currentDate = moment(vm.currentDate).subtract(1, 'year');
        vm.generateCalendar();
    }

    function nextYear() {
        vm.currentDate = moment(vm.currentDate).add(1, 'year');
        vm.generateCalendar();
    }

    function isSelectedMonth(date) {
        return moment(date).isSame(vm.currentDate, 'month');
    }

    function selectDate(date) {
        console.log(date);
        vm.selectedDate = date;
        if (date.events && date.events.length > 0) {
            vm.transactions = date.events;
            date.events.forEach(element => {
                if (element.type == 'INCOME') {
                    vm.incomes = element.items;
                }
                if (element.type == 'SPEND') {
                    vm.spends = element.items;
                }
            });

            $scope.modal.show();
        }
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

    $ionicModal.fromTemplateUrl('calandarDetail.html', {
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
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });

    $scope.$on('$ionicView.beforeEnter', function (e, data) {
        $scope.$root.showMenuIcon = true;
        $scope.$root.showBackIcon = true;
        $scope.$root.menuIconColor = '#0594d9';
    });

    $scope.$on('$ionicView.enter', function () {
        miliuService.preloaderHide();
    });

    $scope.$on('$ionicView.beforeLeave', function () {
        miliuService.preloaderShow();
    });

    $scope.$on('$ionicView.afterLeave', function () {
        miliuService.preloaderHide();
    });

}