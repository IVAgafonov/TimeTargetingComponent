(function () {
    'use strict';
    angular.module('testApp', ['timeTargetingModule'])
        .component('testComponent', {
            template: '<h2>Time targeting simple component</h2><time-targeting-component model="$ctrl.model" options="$ctrl.options"></time-targeting-component><h2>Default model:</h2>'
             +'<p>{{$ctrl.defaultModel}}</p><h2>Are holidays valid:</h2><p>{{$ctrl.isHolidaysValid}}</p><h2>Load from model:</h2><div class="form-group">'
             +'<div class="form-line"><input class="form-control" type="text" ng-model="$ctrl.textModel" placeholder="Insert default model"><button class="btn btn-outline" ng-click="$ctrl.loadModel();">load</button></div></div>'
             +'<h2>Time targeting extended component</h2><time-targeting-component model="$ctrl.modelTwo" options="$ctrl.optionsTwo"></time-targeting-component><h2>Default model:</h2>'
             +'<p>{{$ctrl.defaultModelTwo}}</p><h2>Are holidays valid:</h2><p>{{$ctrl.isHolidaysValidTwo}}</p><h2>Are holidays equals:</h2><p>{{$ctrl.isHolidaysOneValue}}</p><h2 ng-show="$ctrl.isHolidaysOneValue == false || $ctrl.isHolidaysValidTwo == false">Fix all problems</h2><button ng-show="$ctrl.isHolidaysOneValue == false || $ctrl.isHolidaysValidTwo == false" class="btn btn-outline" ng-click="$ctrl.fix();">Fix all</button><h2>Load from model:</h2><div class="form-group">'
             +'<div class="form-line"><input class="form-control" type="text" ng-model="$ctrl.textModelTwo" placeholder="Insert default model"><button class="btn btn-outline" ng-click="$ctrl.loadModelTwo();">load</button></div></div>',
            controller: ['defaultTimeAdapter', 'extendedTimeAdapter', testController]
        });

    function testController(defaultTimeAdapter, extendedTimeAdapter) {
        var vm = this;

        vm.defaultModel = '';
        vm.isHolidaysValid = true;
        vm.textModel = '';
        vm.defaultModelTwo = '';
        vm.isHolidaysValidTwo = true;
        vm.isHolidaysOneValue= true;
        vm.textModelTwo = '';

        vm.model = {};
        vm.modelTwo = {};

        vm.options = {
            days: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс', 'пр'],
            hours: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
            buttons: [
                {
                    name: 'Круглосуточно, вся неделя',
                    coords: [0,0,6,23]
                },
                {
                    name: 'Рабочие часы в будние дни',
                    coords: [0,9,4,18]
                },
                {
                    name: 'Будние дни, круглосуточно',
                    coords: [0,0,4,23]
                },
                {
                    name: 'Пользовательские настройки',
                    coords: [],
                    noclear: true
                }
            ],
            defaultButtonSelected: 1,
            reload: true,
            spacing: [4, 6],
            onChange: function () {
                vm.defaultModel = defaultTimeAdapter.objToString(vm.model);
                vm.isHolidaysValid = defaultTimeAdapter.isHolidaysValid(vm.model);
            },
            onInit: function () {
                console.log('init');
            }
        };

        vm.optionsTwo = {
            days: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс', 'пр'],
            hours: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
            buttons: [
                {
                    name: 'Круглосуточно, вся неделя',
                    coords: [0,0,6,23]
                },
                {
                    name: 'Рабочие часы в будние дни',
                    coords: [0,9,4,18]
                },
                {
                    name: 'Будние дни, круглосуточно',
                    coords: [0,0,4,23]
                },
                {
                    name: 'Пользовательские настройки',
                    coords: [],
                    noclear: true
                }
            ],
            defaultButtonSelected: 1,
            reload: true,
            spacing: [4, 6],
            extended: true,
            extendedTitle: 'Ставка',
            extendedValues: [100,90,80,70,60,50,40,30,20,10,0],
            extendedDefaultValue: 100,
            onChange: function () {
                vm.defaultModelTwo = extendedTimeAdapter.objToString(vm.modelTwo);
                vm.isHolidaysValidTwo = extendedTimeAdapter.isHolidaysValid(vm.modelTwo);
                vm.isHolidaysOneValue = extendedTimeAdapter.isHolidaysOneValue(vm.modelTwo);
            },
            onInit: function () {
                console.log('init');
            }
        };

        vm.loadModel = function() {
            defaultTimeAdapter.stringToObj(vm.textModel, vm.model);
            vm.options.onChange();
        };

        vm.loadModelTwo = function() {
            extendedTimeAdapter.stringToObj(vm.textModelTwo, vm.modelTwo);
            vm.optionsTwo.onChange();
        };

        vm.fix = function() {
            vm.defaultModelTwo = extendedTimeAdapter.objToString(vm.modelTwo, true);
            vm.optionsTwo.onChange();
        }

    }
})();