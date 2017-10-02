(function () {
    'use strict';
    angular.module('testApp', ['timeTargetingModule'])
        .component('testComponent', {
            template: '<h2>Time targeting component</h2><time-targeting-component model="$ctrl.model"></time-targeting-component><h2>Default model:</h2>'
             +'<p>{{$ctrl.defaultModel}}</p><h2>Is holidays valid:</h2><p>{{$ctrl.isHolidaysValid}}</p><h2>Load from model:</h2><div class="form-group">'
             +'<div class="form-line"><input class="form-control" type="text" ng-model="$ctrl.textModel" placeholder="Insert default model"><button class="btn btn-outline" ng-click="$ctrl.loadModel();">load</button></div></div>',
            controller: ['defaultTimeAdapter', testController]
        });

    function testController(defaultTimeAdapter) {
        var vm = this;

        vm.defaultModel = '';
        vm.isHolidaysValid = true;
        vm.textModel = '';

        vm.model = {
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
            grid: {},
            onChange: function () {
                vm.defaultModel = defaultTimeAdapter.objToString(vm.model.grid);
                vm.isHolidaysValid = defaultTimeAdapter.isHolidaysValid(vm.model.grid);
            }
        };

        vm.loadModel = function() {
            defaultTimeAdapter.stringToObj(vm.textModel, vm.model.grid);
        };
    }
})();