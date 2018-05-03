// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('miliu', ['ionic', 'miliu.controllers', 'rzModule', 'googlechart', 'angularMoment', 'ngDraggable', 'ngStorage',
 'ionic-monthpicker', 'proton.multi-list-picker', 'ngSanitize'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        //StatusBar.styleDefault();
        StatusBar.styleBlackTranslucent();
      }
    });

    self && self.webView && self.webView.scrollView && (self.webView.scrollView.bounces = NO);
    angular.element(document.body).on("touchmove", function (event) {
      event.preventDefault();
    });

  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom');

    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'MiliuController'
      })

      .state('app.landing', {
        url: '/landing',
        views: {
          'menuContent': {
            templateUrl: 'templates/landing.html',
            controller: 'LandingController',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.mySpendDashboard', {
        url: '/mySpendDashboard',
        views: {
          'menuContent': {
            templateUrl: 'templates/mySpendDashboard.html',
            controller: 'MySpendDashboardController',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.myTransactions', {
        cache: false,
        url: '/myTransactions',
        views: {
          'menuContent': {
            templateUrl: 'templates/myTransactions.html',
            controller: 'MyTransactionsController',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.myTransactionsDaily', {
        url: '/myTransactionsDaily',
        views: {
          'menuContent': {
            templateUrl: 'templates/myTransactionsDaily.html',
            controller: 'MyTransactionsDailyController',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.calendar', {
        url: '/calendar',
        views: {
          'menuContent': {
            templateUrl: 'templates/calendar.html',
            controller: 'CalendarController',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.calendarDetail', {
        url: '/calendarDetail',
        views: {
          'menuContent': {
            templateUrl: 'templates/calendarDetail.html',
            controller: 'CalendarDetailController',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.mySpend', {
        url: '/mySpend',
        views: {
          'menuContent': {
            templateUrl: 'templates/mySpend.html',
            controller: 'MySpendController',
            controllerAs: 'vm'
          }
        },
        params: {
          mySpendParam: null
        }
      })
      .state('app.myIncome', {
        url: '/myIncome',
        views: {
          'menuContent': {
            templateUrl: 'templates/myIncome.html',
            controller: 'MyIncomeController',
            controllerAs: 'vm'
          }
        },
        params: {
          myIncomeParam: null
        }
      })
      .state('app.myBudget', {
        url: '/myBudget',
        views: {
          'menuContent': {
            templateUrl: 'templates/myBudget.html',
            controller: 'MyBudgetController',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.goals', {
        url: '/goals',
        views: {
          'menuContent': {
            templateUrl: 'templates/goals.html',
            controller: 'GoalsController',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.setGoal', {
        url: '/setGoal',
        views: {
          'menuContent': {
            templateUrl: 'templates/setGoal.html',
            controller: 'SetGoalController',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.setAlert', {
        url: '/setAlert',
        views: {
          'menuContent': {
            templateUrl: 'templates/setAlert.html',
            controller: 'SetAlertController',
            controllerAs: 'vm'
          }
        }
      })
      .state('app.filter', {
        url: '/filter',
        views: {
          'menuContent': {
            templateUrl: 'templates/filter.html',
            controller: 'FilterController',
            controllerAs: 'vm'
          }
        }
      })



      ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/mySpendDashboard');
  });
