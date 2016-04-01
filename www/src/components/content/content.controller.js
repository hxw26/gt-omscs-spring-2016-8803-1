(function () {
    'use strict';

    angular
        .module('app')
        .controller('ContentCtrl', ContentCtrl);

    ContentCtrl.$inject = [
        '$scope',
        '$timeout',
        '$interval',
        '$state',
        'data',
        '_'
    ];

    function ContentCtrl($scope, $timeout, $interval, $state, data, _) {
        var vm = this;

        if (!data) {
            return $state.go('default', { file: 'test01.txt' });
        }

        vm.data = data;

        vm.ranges = {
            x: {
                min: _.minBy(vm.data, '0')[0],
                max: _.maxBy(vm.data, '0')[0]
            },
            y: {
                min: _.minBy(vm.data, '1')[1],
                max: _.maxBy(vm.data, '1')[1]
            }
        };

        vm.slider = {
            steps: vm.data.length,
            active: false,
            interval: null,
            speed: 50,
            min: 0,
            max: vm.data.length
        };

        vm.canvas = document.getElementById('path');
        vm.context = vm.canvas.getContext('2d');

        vm.clickPause = clickPause;
        vm.clickUnpause = clickUnpause;
        vm.clickReset = clickReset;

        vm.disablePause = disablePause;
        vm.disableUnpause = disableUnpause;
        vm.disableReset = disableReset;

        activate();

        ////////////////

        function activate() {
            vm.canvas.width = 630;
            vm.canvas.height = 350;

            $scope.$watch('vm.slider.steps', function () {
                $timeout(draw);
            });

            $scope.$on('$destroy', vm.pause);
        }

        function clickPause() {
            vm.slider.active = false;
            $interval.cancel(vm.slider.interval);
            vm.slider.interval = null;
        }

        function disablePause() {
            return vm.slider.active === false;
        }

        function clickUnpause() {
            vm.slider.active = true;
            vm.slider.interval = $interval(drawOneStep, vm.slider.speed);
        }

        function disableUnpause() {
            return vm.slider.active === true || vm.slider.steps >= vm.slider.max;
        }

        function clickReset() {
            vm.slider.steps = 0;
            vm.clickUnpause();
        }

        function disableReset() {
            return vm.slider.steps < vm.slider.max;
        }

        function drawOneStep() {
            if (vm.slider.steps < vm.slider.max) {
                vm.slider.steps++;
                draw();
            } else {
                vm.pause();
            }
        }

        function draw() {
            vm.context.clearRect(0, 0, vm.canvas.width, vm.canvas.height);
            drawRanges();
            drawCandle();
            drawPoints();
        }

        function drawRanges() {
            vm.context.beginPath();
            vm.context.moveTo(vm.ranges.x.min, vm.ranges.y.min);
            vm.context.lineTo(vm.ranges.x.min, vm.ranges.y.max);
            vm.context.lineTo(vm.ranges.x.max, vm.ranges.y.max);
            vm.context.lineTo(vm.ranges.x.max, vm.ranges.y.min);
            vm.context.lineTo(vm.ranges.x.min, vm.ranges.y.min);
            vm.context.lineWidth = 1;
            vm.context.strokeStyle = '#ddd';
            vm.context.stroke();

            vm.context.font = '16px Arial';
            vm.context.fillText(vm.ranges.x.min + ',' + vm.ranges.y.min,  20,  30);
            vm.context.fillText(vm.ranges.x.min + ',' + vm.ranges.y.max,  20, 345);
            vm.context.fillText(vm.ranges.x.max + ',' + vm.ranges.y.min, 565,  30);
            vm.context.fillText(vm.ranges.x.max + ',' + vm.ranges.y.max, 565, 345);
        }

        function drawCandle() {
            var x = _.floor((vm.ranges.x.min + vm.ranges.x.max) / 2) + 12;
            var y = _.floor((vm.ranges.y.min + vm.ranges.y.max) / 2) -  0;
            var radius = 35;

            vm.context.beginPath();
            vm.context.arc(x, y, radius, 0, 2 * Math.PI);
            vm.context.lineWidth = 2;
            vm.context.strokeStyle = 'rgb(255,64,129)';
            vm.context.stroke();
        }

        function drawPoints() {
            vm.context.beginPath();

            var firstPoint = vm.data[0];
            vm.context.moveTo(firstPoint[0], firstPoint[1]);

            _.forEach(vm.data, function (point, index) {
                if (index > vm.slider.steps) {
                    return false;
                } else if (index > 0) {
                    vm.context.lineTo(point[0], point[1]);
                }
            });

            vm.context.lineWidth = 1;
            vm.context.strokeStyle = 'rgb(40,53,147)';
            vm.context.stroke();
        }
    }
})();
