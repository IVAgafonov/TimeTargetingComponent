(function () {
    'use strict';
    angular.module('timeTargetingModule', [])
        .service('defaultTimeAdapter', [function () {
            return {
                objToString: function (obj, fix_errors) {
                    var caps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    var result = '';
                    var strByDay;
                    var day = 0;
                    var fix_errors = fix_errors || false;
                    for (var d in obj) {
                        if (!obj.hasOwnProperty(d)) {
                            continue;
                        }
                        day++;
                        strByDay = '';

                        for (var h in obj[d]) {
                            if (obj[d][h]) {
                                strByDay += caps.charAt(h);
                            }
                        }
                        if (day == 8 && strByDay.length) {
                            var fullStr = caps.slice(caps.indexOf(strByDay[0]), caps.indexOf(strByDay[strByDay.length-1])+1);
                            if (strByDay != fullStr && fix_errors) {
                                for (var r = caps.indexOf(strByDay[0]); r < caps.indexOf(strByDay[strByDay.length-1])+1; r++) {
                                    obj[d][r] = 1;
                                }
                                strByDay = fullStr;
                            }
                        }

                        if (strByDay.length) {
                            result += day + strByDay;
                        }
                    }
                    return result;
                },
                stringToObj: function(str, obj) {

                },
                isHolidaysValid: function (obj) {
                    var caps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    var result = false;
                    var strByDay;
                    var day = 0;
                    for (var d in obj) {
                        day++;
                        if (day != 8) {
                            continue;
                        }
                        strByDay = '';

                        for (var h in obj[d]) {
                            if (obj[d][h]) {
                                strByDay += caps.charAt(h);
                            }
                        }
                        if (strByDay.length) {
                            var fullStr = caps.slice(caps.indexOf(strByDay[0]), caps.indexOf(strByDay[strByDay.length-1])+1);
                            if (strByDay == fullStr) {
                                result = true;
                            }
                        } else {
                            result = true;
                        }
                    }
                    return result;
                }
            }
        }])
        .component('timeTargetingComponent', {
            bindings: {
                model: '='
            },
            template:'<div class="row time-targeting" ng-init="$ctrl.selectTimeTargeting($ctrl.model.defaultButtonSelected);"><div class="form-group"><div class="form-line"><div class="btn-group"><a class="btn btn-outline" ng-class="{\'btn-active\': button.selected}" ng-click="$ctrl.selectTimeTargeting($index);" ng-repeat="button in $ctrl.model.buttons track by $index">{{button.name}}</a> <a ng-show="$ctrl.model.reload == true" ng-click="$ctrl.selectByCoords(-1);" class="undo"><span class="undo-icon"><i class="f-ico i-refresh"></i></span> <span class="undo-text">Сбросить</span></a></div></div></div><table class="checkbox-zone"><thead><tr><th></th><th class="noselect" ng-click="$ctrl.selectColumn($index);" ng-repeat="hour in $ctrl.model.hours track by $index"><span>{{hour}}</span></th></tr></thead><tbody ng-mouseup="$ctrl.selectEnd();" nng-mo="$ctrl.selectEnd();"><tr ng-repeat-start="day in $ctrl.model.days track by $index"><th ng-click="$ctrl.selectRow($index);" class="noselect"><span>{{day}}</span></th><td ng-repeat="hour in $ctrl.model.hours track by $index" ng-mousedown="$ctrl.selectStart($parent.$index, $index);" ng-mouseup="$ctrl.selectEnd();" ng-mouseenter="$ctrl.selectEnter($parent.$index, $index);"><div class="form-check"><input type="checkbox" class="checkbox" id="wd-{{$parent.$index}}-h-{{$index}}" ng-model="$ctrl.model.grid[$parent.$index][$index]" , ng-change="$ctrl.model.onChange()" ng-init="0" ng-false-value="0" ng-true-value="1"> <label for="wd-{{$parent.$index}}-h-{{$index}}"><span class="form-check-control"></span></label></div></td></tr><tr ng-repeat-end ng-if="$ctrl.model.spacing.indexOf($index) != -1" class="time-targeting-spacing"></tr></tbody></table></div>',
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

        vm.$onInit = function() {
            for (var d = 0; d < vm.model.days.length; d++) {
                vm.model.grid[d] = {};
                for (var h = 0; h < vm.model.hours.length; h++) {
                    vm.model.grid[d][h] = 0;
                }
            }
        };

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
            vm.model.onChange();
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
            vm.model.onChange();
        };

        vm.selectByCoords = function (index) {
            if (index != -1 && vm.model.buttons[index].noclear) {
                vm.model.onChange();
                return;
            }

            for (var d = 0; d < vm.model.days.length; d++) {
                for (var h = 0; h < vm.model.hours.length; h++) {
                    vm.model.grid[d][h] = 0;
                }
            }

            if (index === -1) {
                vm.model.onChange();
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
            vm.model.onChange();
        };

        vm.selectEnd = function () {
            vm.selectStartDay = '';
            vm.selectStartHour = '';
            vm.model.onChange();
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