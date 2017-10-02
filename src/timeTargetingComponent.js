(function () {
    'use strict';
    angular.module('timeTargetingModule', [])
        .component('timeTargetingComponent', {
            bindings: {
                model: '='
            },
            templateUrl: 'timeTargetingComponent.html',
            controller: ['$timeout', timeTargetingController]
        });

    function timeTargetingController($timeout) {
        var vm = this;

        vm.selectValue = 0;
        vm.selectStartDay = '';
        vm.selectStartHour = '';

        vm.selectStartDayFor = 0;
        vm.selectEndDayFor = 0;
        vm.selectStartHourFor = 0;
        vm.selectEndHourFor = 0;

        vm.defaultSelectValue = 1;

        vm.selectStart = function (dayIndex, hourIndex) {
            vm.selectStartDay = dayIndex;
            vm.selectStartHour = hourIndex;
            if (vm.model.grid[dayIndex][hourIndex]) {
                vm.selectValue = 0;
            } else {
                vm.selectValue = 1;
            }

            angular.element(document).one('mouseup', function() {
                vm.selectEnd();
            });
        };

        vm.selectEnter = function(dayIndex, hourIndex) {
            if (vm.selectStartDay > dayIndex) {
                vm.selectStartDayFor = dayIndex;
                vm.selectEndDayFor = vm.selectStartDay;
            } else {
                vm.selectStartDayFor = vm.selectStartDay;
                vm.selectEndDayFor = dayIndex;
            }

            if (vm.selectStartHour > hourIndex) {
                vm.selectStartHourFor = hourIndex;
                vm.selectEndHourFor = vm.selectStartHour;
            } else {
                vm.selectStartHourFor = vm.selectStartHour;
                vm.selectEndHourFor = hourIndex;
            }

            if (vm.selectStartDay !== '') {
                for (var d = vm.selectStartDayFor; d <= vm.selectEndDayFor; d++) {
                    for (var h = vm.selectStartHourFor; h <= vm.selectEndHourFor; h++) {
                        vm.model.grid[d][h] = vm.selectValue;
                    }
                }
            }
        };

        vm.selectColumn = function (index) {
            var selected = 1;
            for (var d = 0; d < vm.model.days.length; d++) {
                if (vm.model.grid[d][index] == 0) {
                    selected = 0;
                    break;
                }
            }
            vm.selectValue = selected ? 0 : 1;
            for (d = 0; d < vm.model.days.length; d++) {
                vm.model.grid[d][index] = vm.selectValue;
            }
        };

        vm.selectRow = function (index) {
            var selected = 1;
            for (var h = 0; h < vm.model.hours.length; h++) {
                if (vm.model.grid[index][h] == 0) {
                    selected = 0;
                    break;
                }
            }
            vm.selectValue = selected ? 0 : 1;
            for (h = 0; h < vm.model.hours.length; h++) {
                vm.model.grid[index][h] = vm.selectValue;
            }
        };

        vm.selectByCoords = function (index) {
            if (index != -1 && vm.model.buttons[index].noclear) {
                return;
            }

            for (var d = 0; d < vm.model.days.length; d++) {
                for (var h = 0; h < vm.model.hours.length; h++) {
                    vm.model.grid[d][h] = 0;
                }
            }

            if (index === -1) {
                return;
            }

            if (vm.model.buttons[index].coords.length) {
                vm.selectStartDayFor = vm.model.buttons[index].coords[0];
                vm.selectEndDayFor = vm.model.buttons[index].coords[2];
                vm.selectStartHourFor = vm.model.buttons[index].coords[1];
                vm.selectEndHourFor = vm.model.buttons[index].coords[3];

                for (d = vm.selectStartDayFor; d <= vm.selectEndDayFor; d++) {
                    for (h = vm.selectStartHourFor; h <= vm.selectEndHourFor; h++) {
                        vm.model.grid[d][h] = vm.defaultSelectValue;
                    }
                }
            }
        };

        vm.selectEnd = function () {
            vm.selectStartDay = '';
            vm.selectStartHour = '';
        };

        vm.selectTimeTargeting = function(index) {
            for (var i = 0; i < vm.model.buttons.length; i++) {
                vm.model.buttons[i].selected = false;
            }
            vm.model.buttons[index].selected = true;
            vm.selectByCoords(index);
        };
    }
})();