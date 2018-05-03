angular
  .module('miliu')
  .directive('miliuTapToSwipe', tapToSwipe);
tapToSwipe.$inject = ['$ionicGesture']
function tapToSwipe($ionicGesture) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var stopSwipe = true;
      attrs.$observe('stopSwipe', function (value) {
        stopSwipe = value;
        if(stopSwipe != value){
          if (stopSwipe == "false") {
            var content = element[0].querySelector('.item-content');
  
            var buttons = element[0].querySelector('.item-options');
            var buttonsWidth = buttons.offsetWidth;
  
            ionic.requestAnimationFrame(function () {
              content.style[ionic.CSS.TRANSITION] = 'all ease-out .25s';
  
              if (!buttons.classList.contains('invisible')) {
                content.style[ionic.CSS.TRANSFORM] = '';
                setTimeout(function () {
                  buttons.classList.add('invisible');
                }, 250);
              } else {
                buttons.classList.remove('invisible');
                content.style[ionic.CSS.TRANSFORM] = 'translate3d(-' + buttonsWidth + 'px, 0, 0)';
              }
            });
          }
        }
      });
      $ionicGesture.on('tap', function (e) {
        if (stopSwipe == "false") {
          var content = element[0].querySelector('.item-content');

          var buttons = element[0].querySelector('.item-options');
          var buttonsWidth = buttons.offsetWidth;

          ionic.requestAnimationFrame(function () {
            content.style[ionic.CSS.TRANSITION] = 'all ease-out .25s';

            if (!buttons.classList.contains('invisible')) {
              content.style[ionic.CSS.TRANSFORM] = '';
              setTimeout(function () {
                buttons.classList.add('invisible');
              }, 250);
            } else {
              buttons.classList.remove('invisible');
              content.style[ionic.CSS.TRANSFORM] = 'translate3d(-' + buttonsWidth + 'px, 0, 0)';
            }
          });
        }


      }, element);
    }
  };
}