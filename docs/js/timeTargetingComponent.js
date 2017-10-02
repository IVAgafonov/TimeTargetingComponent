(function () {
    'use strict';
    angular.module('timeTargetingModule', [])
        .component('timeTargetingComponent', {
            bindings: {
                model: '='
            },
            template:'<div class="row time-targeting" ng-init="$ctrl.selectTimeTargeting($ctrl.model.defaultButtonSelected);"><div class="form-group"><div class="form-line"><div class="btn-group"><a class="btn btn-outline" ng-class="{\'btn-active\': button.selected}" ng-click="$ctrl.selectTimeTargeting($index);" ng-repeat="button in $ctrl.model.buttons track by $index">{{button.name}}</a> <a ng-show="$ctrl.model.reload == true" ng-click="$ctrl.selectByCoords(-1);" class="undo"><span class="undo-icon"><i class="f-ico i-refresh"></i></span> <span class="undo-text">Сбросить</span></a></div></div></div><table class="checkbox-zone"><thead><tr><th></th><th class="noselect" ng-click="$ctrl.selectColumn($index);" ng-repeat="hour in $ctrl.model.hours track by $index"><span>{{hour}}</span></th></tr></thead><tbody ng-mouseup="$ctrl.selectEnd();" nng-mo="$ctrl.selectEnd();"><tr ng-repeat-start="day in $ctrl.model.days track by $index"><th ng-click="$ctrl.selectRow($index);" class="noselect"><span>{{day}}</span></th><td ng-repeat="hour in $ctrl.model.hours track by $index" ng-mousedown="$ctrl.selectStart($parent.$index, $index);" ng-mouseup="$ctrl.selectEnd();" ng-mouseenter="$ctrl.selectEnter($parent.$index, $index);"><div class="form-check"><input type="checkbox" class="checkbox" id="wd-{{$parent.$index}}-h-{{$index}}" ng-model="$ctrl.model.grid[$parent.$index][$index]" ng-init="0" ng-false-value="0" ng-true-value="1"> <label for="wd-{{$parent.$index}}-h-{{$index}}"><span class="form-check-control"></span></label></div></td></tr><tr ng-repeat-end ng-if="$ctrl.model.spacing.indexOf($index) != -1" class="time-targeting-spacing"></tr></tbody></table></div>',
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