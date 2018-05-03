angular
    .module('miliu')
    .directive('miliuStyles', miliuStyles);

miliuStyles.$inject = []

function miliuStyles() {
    return {
        scope: {
            miliuStyBackgoundColor: '@miliuStyBackgoundColor',
            miliuStyWidth: '@miliuStyWidth',
            miliuStyColor: '@miliuStyColor'
        },
        restrict: "A",
        link: function link(scope, element, attrs) {
            attrs.$observe('miliuStyBackgoundColor', function (value) {
                element.css({
                    backgroundColor: value,
                });
            });

            attrs.$observe('miliuStyWidth', function (value) {
                value = value ? value : 0
                element.css({
                    width: value,
                });
            });

            attrs.$observe('miliuStyColor', function (value) {
                element.css({
                    color: value,
                });
            });
        }
    };
}