(function () {
    'use strict';
    angular.module('timeTargetingModule', [])
        .service('defaultTimeAdapter', [function () {
            return {
                caps: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                objToString: function (obj, fix_errors) {
                    var result = '';
                    var strByDay;
                    var day = 0;
                    fix_errors = fix_errors || false;
                    for (var d in obj) {
                        if (!obj.hasOwnProperty(d)) {
                            continue;
                        }
                        day++;
                        strByDay = '';

                        for (var h in obj[d]) {
                            if (obj[d][h]) {
                                strByDay += this.caps.charAt(h);
                            }
                        }
                        if (day == 8 && strByDay.length) {
                            var fullStr = this.caps.slice(this.caps.indexOf(strByDay[0]), this.caps.indexOf(strByDay[strByDay.length-1])+1);
                            if (strByDay != fullStr && fix_errors) {
                                for (var r = this.caps.indexOf(strByDay[0]); r < this.caps.indexOf(strByDay[strByDay.length-1])+1; r++) {
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
                    function isNumeric(n) {
                        return !isNaN(parseFloat(n)) && isFinite(n);
                    }
                    for (var d in obj) {
                        for (var h in obj[d]) {
                            if (obj[d][h]) {
                                obj[d][h] = false;
                            }
                        }
                    }
                    if (str.length) {
                        for (var i in str) {
                            if (str.hasOwnProperty(i) && isNumeric(str[i])) {
                                for (var n = i; n < str.length; n++) {
                                    if (n == i) {
                                        continue;
                                    }
                                    if (isNumeric(str[n])) {
                                        break;
                                    } else {
                                        obj[str[i]-1][this.caps.indexOf(str[n])] = 1;
                                    }
                                }
                            }
                        }
                    }
                },
                isHolidaysValid: function (obj) {
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
                                strByDay += this.caps.charAt(h);
                            }
                        }
                        if (strByDay.length) {
                            var fullStr = this.caps.slice(this.caps.indexOf(strByDay[0]), this.caps.indexOf(strByDay[strByDay.length-1])+1);
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
        .service('extendedTimeAdapter', [function () {
            return {
                caps: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                low: "abcdefghijklmnopqrstubwxyz",
                objToString: function (obj, fix_errors) {
                    var result = '';
                    var strByDay;
                    var strByDayCaps;
                    var day = 0;
                    var firstFindedHoliday = 0;
                    var holidaysCount = 0;
                    var holidaysSum = 0;
                    var hasErrors = false;
                    fix_errors = fix_errors || false;
                    for (var d in obj) {
                        if (!obj.hasOwnProperty(d)) {
                            continue;
                        }
                        day++;
                        strByDay = '';
                        strByDayCaps = '';

                        for (var h in obj[d]) {
                            if (obj[d][h]) {
                                strByDay += this.caps.charAt(h);
                                strByDayCaps += this.caps.charAt(h);
                                if (obj[d][h] > 0 && obj[d][h] < 100) {
                                    strByDay+= this.low.charAt(obj[d][h]/10)
                                }
                            }
                        }
                        if (day == 8 && strByDay.length) {
                            var fullStr = this.caps.slice(this.caps.indexOf(strByDay[0]), this.caps.indexOf(strByDay[strByDay.length-1])+1);
                            for (var r = this.caps.indexOf(strByDayCaps[0]); r < this.caps.indexOf(strByDayCaps[strByDayCaps.length-1])+1; r++) {
                                firstFindedHoliday = firstFindedHoliday ? firstFindedHoliday : obj[d][r];
                                if (obj[d][r] != 0) {
                                    holidaysCount++;
                                    holidaysSum += obj[d][r];
                                    if (firstFindedHoliday != obj[d][r]) {
                                        hasErrors = true;
                                    }
                                }
                            }
                            if ((strByDay != fullStr) && fix_errors) {
                                for (r = this.caps.indexOf(strByDayCaps[0]); r < this.caps.indexOf(strByDayCaps[strByDayCaps.length-1])+1; r++) {
                                    obj[d][r] = Math.round(holidaysSum/holidaysCount/10) * 10;
                                }
                                strByDay = fullStr;
                            }
                            if (hasErrors && fix_errors) {
                                return this.objToString(obj, true);
                            }
                        }

                        if (strByDay.length) {
                            result += day + strByDay;
                        }
                    }
                    return result;
                },
                stringToObj: function(str, obj) {
                    function isNumeric(n) {
                        return !isNaN(parseFloat(n)) && isFinite(n);
                    }
                    for (var d in obj) {
                        for (var h in obj[d]) {
                            if (obj[d][h]) {
                                obj[d][h] = 0;
                            }
                        }
                    }
                    if (str.length) {
                        for (var i in str) {
                            if (str.hasOwnProperty(i) && isNumeric(str[i])) {
                                for (var n = i; n < str.length; n++) {
                                    if (n == i) {
                                        continue;
                                    }
                                    if (isNumeric(str[n])) {
                                        break;
                                    } else {
                                        if (str[n + 1] && str.charCodeAt(n + 1) > 96) {
                                            obj[str[i]-1][this.caps.indexOf(str[n])] = this.low.indexOf(str[n + 1]) * 10;
                                            n++;
                                        } else {
                                            obj[str[i]-1][this.caps.indexOf(str[n])] = 100;
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                isHolidaysValid: function (obj) {
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
                                strByDay += this.caps.charAt(h);
                            }
                        }
                        if (strByDay.length) {
                            var fullStr = this.caps.slice(this.caps.indexOf(strByDay[0]), this.caps.indexOf(strByDay[strByDay.length-1])+1);
                            if (strByDay == fullStr) {
                                result = true;
                            }
                        } else {
                            result = true;
                        }
                    }
                    return result;
                },
                isHolidaysOneValue: function (obj) {
                    var result = true;
                    var strByDay;
                    var day = 0;
                    var firstFindedValue = 0;
                    for (var d in obj) {
                        day++;
                        if (day != 8) {
                            continue;
                        }
                        strByDay = '';

                        for (var h in obj[d]) {
                            if (obj[d][h]) {
                                if (obj[d][h]) {
                                    firstFindedValue = firstFindedValue ? firstFindedValue : obj[d][h];
                                    if (firstFindedValue && firstFindedValue != obj[d][h]) {
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                    return result;
                }
            }
        }])
        .component('timeTargetingComponent', {
            bindings: {
                model: '=',
                options: '<'
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

        vm.$onInit = function() {
            vm.options = vm.options || {};
            vm.options.days = vm.options.days || ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс', 'пр'];
            vm.options.hours = vm.options.hours || ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
            vm.options.buttons = vm.options.buttons || [];
            vm.options.defaultButtonSelected = vm.options.defaultButtonSelected || 1;
            vm.options.reload = vm.options.reload || true;
            vm.options.spacing = vm.options.spacing || [4, 6];

            for (var d = 0; d < vm.options.days.length; d++) {
                vm.model[d] = {};
                for (var h = 0; h < vm.options.hours.length; h++) {
                    vm.model[d][h] = 0;
                }
            }
            if (vm.options.extendedDefaultValue) {
                vm.selectValue = vm.options.extendedDefaultValue;
            }
            if (vm.options.onInit) {
                vm.options.onInit();
            }
        };

        vm.extendedChange = function (y, x) {
            vm.model[y][x] = vm.model[y][x] ? (vm.model[y][x] != vm.selectValue ? vm.selectValue : 0) : vm.selectValue;
            vm.options.onChange();
        };

        vm.selectStart = function (dayIndex, hourIndex) {
            vm.selectStartDay = dayIndex;
            vm.selectStartHour = hourIndex;

            if (vm.options.extended) {
                if (vm.model[dayIndex][hourIndex] == vm.selectValue) {
                    vm.selectValue = 0;
                }
            } else {
                if (vm.model[dayIndex][hourIndex]) {
                    vm.selectValue = 0;
                } else {
                    vm.selectValue = 1;
                }
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
                        vm.model[d][h] = vm.selectValue;
                    }
                }
            }
        };

        vm.selectColumn = function (index) {
            var selected = 1;
            for (var d = 0; d < vm.options.days.length; d++) {
                if (vm.model[d][index] == 0) {
                    selected = 0;
                    break;
                }
            }
            for (d = 0; d < vm.options.days.length; d++) {
                vm.model[d][index] = (selected ? 0 : (vm.options.extended ? vm.selectValue : 1));
            }
            if (vm.options.onChange) {
                vm.options.onChange();
            }
        };

        vm.selectRow = function (index) {
            var selected = 1;
            for (var h = 0; h < vm.options.hours.length; h++) {
                if (vm.model[index][h] == 0) {
                    selected = 0;
                    break;
                }
            }
            for (h = 0; h < vm.options.hours.length; h++) {
                vm.model[index][h] = (selected ? 0 : (vm.options.extended ? vm.selectValue : 1));
            }
            if (vm.options.onChange) {
                vm.options.onChange();
            }
        };

        vm.selectByCoords = function (index) {
            if (index != -1 && vm.options.buttons[index].noclear) {
                if (vm.options.onChange) {
                    vm.options.onChange();
                }
                return;
            }

            for (var d = 0; d < vm.options.days.length; d++) {
                for (var h = 0; h < vm.options.hours.length; h++) {
                    vm.model[d][h] = 0;
                }
            }

            if (index === -1) {
                if (vm.options.onChange) {
                    vm.options.onChange();
                }
                return;
            }

            if (vm.options.buttons[index].coords.length) {
                vm.selectStartDayFor = vm.options.buttons[index].coords[0];
                vm.selectEndDayFor = vm.options.buttons[index].coords[2];
                vm.selectStartHourFor = vm.options.buttons[index].coords[1];
                vm.selectEndHourFor = vm.options.buttons[index].coords[3];

                for (d = vm.selectStartDayFor; d <= vm.selectEndDayFor; d++) {
                    for (h = vm.selectStartHourFor; h <= vm.selectEndHourFor; h++) {
                        vm.model[d][h] = vm.selectValue ? vm.selectValue : (vm.options.extended ? vm.selectValue : 1);
                    }
                }
            }
            if (vm.options.onChange) {
                vm.options.onChange();
            }
        };

        vm.selectEnd = function () {
            vm.selectStartDay = '';
            vm.selectStartHour = '';
            if (vm.options.onChange) {
                vm.options.onChange();
            }
        };

        vm.selectTimeTargeting = function(index) {
            for (var i = 0; i < vm.options.buttons.length; i++) {
                vm.options.buttons[i].selected = false;
            }
            vm.options.buttons[index].selected = true;
            vm.selectByCoords(index);
        };
    }
})();