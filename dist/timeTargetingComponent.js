!function(){"use strict";angular.module("timeTargetingModule",[]).service("defaultTimeAdapter",[function(){return{caps:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",objToString:function(e,t){var n,o="",r=0;t=t||!1;for(var l in e)if(e.hasOwnProperty(l)){r++,n="";for(var s in e[l])e[l][s]&&(n+=this.caps.charAt(s));if(8==r&&n.length){var a=this.caps.slice(this.caps.indexOf(n[0]),this.caps.indexOf(n[n.length-1])+1);if(n!=a&&t){for(var c=this.caps.indexOf(n[0]);c<this.caps.indexOf(n[n.length-1])+1;c++)e[l][c]=1;n=a}}n.length&&(o+=r+n)}return o},stringToObj:function(e,t){function n(e){return!isNaN(parseFloat(e))&&isFinite(e)}for(var o in t)for(var r in t[o])t[o][r]&&(t[o][r]=!1);if(e.length)for(var l in e)if(e.hasOwnProperty(l)&&n(e[l]))for(var s=l;s<e.length;s++)if(s!=l){if(n(e[s]))break;console.log(e[l]),console.log(this.caps.indexOf(e[s])),t[e[l]-1][this.caps.indexOf(e[s])]=1}},isHolidaysValid:function(e){var t,n=!1,o=0;for(var r in e)if(8==++o){t="";for(var l in e[r])e[r][l]&&(t+=this.caps.charAt(l));t.length?t==this.caps.slice(this.caps.indexOf(t[0]),this.caps.indexOf(t[t.length-1])+1)&&(n=!0):n=!0}return n}}}]).component("timeTargetingComponent",{bindings:{model:"="},template:'<div class="row time-targeting" ng-init="$ctrl.selectTimeTargeting($ctrl.model.defaultButtonSelected);"><div class="form-group"><div class="form-line"><div class="btn-group"><a class="btn btn-outline" ng-class="{\'btn-active\': button.selected}" ng-click="$ctrl.selectTimeTargeting($index);" ng-repeat="button in $ctrl.model.buttons track by $index">{{button.name}}</a> <a ng-show="$ctrl.model.reload == true" ng-click="$ctrl.selectByCoords(-1);" class="undo"><span class="undo-icon"><i class="f-ico i-refresh"></i></span> <span class="undo-text">Сбросить</span></a></div></div></div><table class="checkbox-zone"><thead><tr><th></th><th class="noselect" ng-click="$ctrl.selectColumn($index);" ng-repeat="hour in $ctrl.model.hours track by $index"><span>{{hour}}</span></th></tr></thead><tbody ng-mouseup="$ctrl.selectEnd();" nng-mo="$ctrl.selectEnd();"><tr ng-repeat-start="day in $ctrl.model.days track by $index"><th ng-click="$ctrl.selectRow($index);" class="noselect"><span>{{day}}</span></th><td ng-repeat="hour in $ctrl.model.hours track by $index" ng-mousedown="$ctrl.selectStart($parent.$index, $index);" ng-mouseup="$ctrl.selectEnd();" ng-mouseenter="$ctrl.selectEnter($parent.$index, $index);"><div class="form-check"><input type="checkbox" class="checkbox" id="wd-{{$parent.$index}}-h-{{$index}}" ng-model="$ctrl.model.grid[$parent.$index][$index]" , ng-change="$ctrl.model.onChange()" ng-init="0" ng-false-value="0" ng-true-value="1"> <label for="wd-{{$parent.$index}}-h-{{$index}}"><span class="form-check-control"></span></label></div></td></tr><tr ng-repeat-end ng-if="$ctrl.model.spacing.indexOf($index) != -1" class="time-targeting-spacing"></tr></tbody></table></div>',controller:["$timeout",function(e){var t=this;t.selectValue=0,t.selectStartDay="",t.selectStartHour="",t.selectStartDayFor=0,t.selectEndDayFor=0,t.selectStartHourFor=0,t.selectEndHourFor=0,t.defaultSelectValue=1,t.$onInit=function(){for(var e=0;e<t.model.days.length;e++){t.model.grid[e]={};for(var n=0;n<t.model.hours.length;n++)t.model.grid[e][n]=0}},t.selectStart=function(e,n){t.selectStartDay=e,t.selectStartHour=n,t.model.grid[e][n]?t.selectValue=0:t.selectValue=1,angular.element(document).one("mouseup",function(){t.selectEnd()})},t.selectEnter=function(e,n){if(t.selectStartDay>e?(t.selectStartDayFor=e,t.selectEndDayFor=t.selectStartDay):(t.selectStartDayFor=t.selectStartDay,t.selectEndDayFor=e),t.selectStartHour>n?(t.selectStartHourFor=n,t.selectEndHourFor=t.selectStartHour):(t.selectStartHourFor=t.selectStartHour,t.selectEndHourFor=n),""!==t.selectStartDay)for(var o=t.selectStartDayFor;o<=t.selectEndDayFor;o++)for(var r=t.selectStartHourFor;r<=t.selectEndHourFor;r++)t.model.grid[o][r]=t.selectValue},t.selectColumn=function(e){for(var n=1,o=0;o<t.model.days.length;o++)if(0==t.model.grid[o][e]){n=0;break}for(t.selectValue=n?0:1,o=0;o<t.model.days.length;o++)t.model.grid[o][e]=t.selectValue;t.model.onChange()},t.selectRow=function(e){for(var n=1,o=0;o<t.model.hours.length;o++)if(0==t.model.grid[e][o]){n=0;break}for(t.selectValue=n?0:1,o=0;o<t.model.hours.length;o++)t.model.grid[e][o]=t.selectValue;t.model.onChange()},t.selectByCoords=function(e){if(-1!=e&&t.model.buttons[e].noclear)t.model.onChange();else{for(var n=0;n<t.model.days.length;n++)for(var o=0;o<t.model.hours.length;o++)t.model.grid[n][o]=0;if(-1!==e){if(t.model.buttons[e].coords.length)for(t.selectStartDayFor=t.model.buttons[e].coords[0],t.selectEndDayFor=t.model.buttons[e].coords[2],t.selectStartHourFor=t.model.buttons[e].coords[1],t.selectEndHourFor=t.model.buttons[e].coords[3],n=t.selectStartDayFor;n<=t.selectEndDayFor;n++)for(o=t.selectStartHourFor;o<=t.selectEndHourFor;o++)t.model.grid[n][o]=t.defaultSelectValue;t.model.onChange()}else t.model.onChange()}},t.selectEnd=function(){t.selectStartDay="",t.selectStartHour="",t.model.onChange()},t.selectTimeTargeting=function(e){for(var n=0;n<t.model.buttons.length;n++)t.model.buttons[n].selected=!1;t.model.buttons[e].selected=!0,t.selectByCoords(e)}}]})}();