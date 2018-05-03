angular
  .module('miliu')
  .controller('MySpendController', MySpendController);

MySpendController.$inject = ['$state', 'miliuService', '$scope', '$filter', '$stateParams', 'googleChartApiPromise','$timeout']

function MySpendController($state, miliuService, $scope, $filter, $stateParams, googleChartApiPromise,$timeout) {
  var vm = this;
  var chartObj;
  var today = new Date();
  var periodOfTime = miliuService.filterState ? miliuService.filterState.periodOfTime :
    {
      startDate: new Date(today.getFullYear(), today.getMonth(), 1),
      endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0)
    };

  vm.displayPeriodOfTime = $filter('date')(periodOfTime.startDate, 'd ') + ' - ' +
    $filter('date')(periodOfTime.endDate, 'd MMM, yyyy');

  vm.totalSpend = $stateParams.mySpendParam ? $stateParams.mySpendParam.totalSpend : 0;

  vm.navigate = navigate;

  vm.slidingData = {
    hide: false
  };
  vm.options = {
    loop: false,
    effect: 'fade',
    speed: 1000,
  };
  vm.slidingEnable = slidingEnable;

  vm.onChartSwipeLeft = onChartSwipeLeft;
  vm.onChartSwipeRight = onChartSwipeRight;
  vm.startDateIndex = 0;

  vm.calandarData = [];
  vm.categories = [];

  var agcContainer;
  vm.agcOnMouseout = changeAgcBorderRadius;
  vm.agcOnMouseover = changeAgcBorderRadius;
  vm.agcOnSelect = changeAgcBorderRadius;
  vm.agcOnReady = changeAgcBorderRadius;

  getMySepndData();

  function getMySepndData() {
    miliuService.preloaderShow();
    return miliuService.getMySepndData()
      .then(function (data) {
        vm.calandarData = _.filter(data.calandarData, (cData) => {
          return today >= new Date(cData.date)
        });

        vm.calandarData = _.filter(vm.calandarData, (cData) => {
          return periodOfTime.startDate <= new Date(cData.date)
        })

        vm.startDateIndex = vm.calandarData.length - 7;
        vm.startDateIndex = vm.startDateIndex >= 0 ? vm.startDateIndex : 0;
        vm.displayData = vm.calandarData.slice(vm.startDateIndex, (vm.startDateIndex + 7));

        vm.categories = data.categories;
        chartObj = data.myChartObject;
        vm.myChartObject = initChart();
        miliuService.preloaderHide();
      }, () => {
        miliuService.preloaderHide();
      });
  }

  function onChartSwipeLeft() {
    console.log('swap left');
    vm.slidingData.hide = true;
    if (vm.startDateIndex < (vm.calandarData.length - 1)) {
      vm.startDateIndex++;
      vm.displayData = vm.calandarData.slice(vm.startDateIndex, (vm.startDateIndex + 7));
      vm.myChartObject = initChart();
    }

  }

  function onChartSwipeRight() {
    console.log('swap right');
    if (vm.startDateIndex > 0) {
      vm.startDateIndex--;
      vm.displayData = vm.calandarData.slice(vm.startDateIndex, (vm.startDateIndex + 7));
      vm.myChartObject = initChart();
    }

  }

  function initChart() {
    chartObj.data.rows = vm.displayData
    return chartObj;
  }


  $scope.$on("$ionicSlides.sliderInitialized", function (event, data) {
    // data.slider is the instance of Swiper
    $scope.slider = data.slider;
    console.log('init slide', $scope.slider);
  });

  $scope.$on("$ionicSlides.slideChangeStart", function (event, data) {
    console.log('Slide change is beginning: ' + $scope.slider.activeIndex);
    stopStartSliding();

  });

  $scope.$on("$ionicSlides.slideChangeEnd", function (event, data) {
    // note: the indexes are 0-based
    stopStartSliding();
    console.log('slide end');
  });

  function slidingEnable() {
    console.log('swipBottomRight');
    vm.slidingData.hide = false;
  }

  function stopStartSliding() {
    switch ($scope.slider.activeIndex) {
      case 0:
        vm.slidingData.hide = false;
        break;
      case 1:
        vm.slidingData.hide = true;
        break;
    }
  }

  /**
   * Navigate clicking on button
   * 
   * @param {any} state - state of the page
   */
  function navigate(state) {
    $state.go(state)
  }

  googleChartApiPromise.then(() => {
    $timeout(() => {
      agcContainer = document.getElementById('agcMySpendDiv');
      changeAgcBorderRadius();
    }, 100)

  })

  function changeAgcBorderRadius() {
    if (agcContainer) {
      chartColumns = agcContainer.getElementsByTagName('rect');
      Array.prototype.forEach.call(chartColumns, function (column) {
        column.setAttribute('rx', 5);
        column.setAttribute('ry', 5);
      });
    }
  }

  $scope.$on('$ionicView.beforeEnter', function (e, data) {
    $scope.$root.showMenuIcon = false;
    $scope.$root.showBackIcon = true;
    $scope.$root.menuIconColor = '#0594d9';
  });

  $scope.$on('$ionicView.beforeLeave', function () {
    miliuService.preloaderShow();
  });

}