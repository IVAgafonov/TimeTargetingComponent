### Time targeting component for angular 1.6.x

Example: 

You can see example in ./docs/ (https://ivagafonov.github.io/TimeTargetingComponent/)

**Setup:**

Install with npm
```bash
npm install time-targeting-component --save
```

Install with bower
```bash
bower install time-targeting-component --save
```

**Usage:**

1. Add require module:
```js
angular.module('app', ['timeTargetingModule'])
```

2. Add html component and resolve 'model' dependency
```html
<time-targeting-component model="$ctrl.model" options="$ctrl.options"></time-targeting-component>
```

3. Create time targeting model in parent controller
```js
var vm = this;

vm.model = {}

vm.options = {
            days: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс', 'пр'],
            hours: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
            buttons: [
                {
                    name: 'Круглосуточно, вся неделя',
                    model: '1ABCDEFGHIJKLMNOPQRSTUVWX2ABCDEFGHIJKLMNOPQRSTUVWX3ABCDEFGHIJKLMNOPQRSTUVWX4ABCDEFGHIJKLMNOPQRSTUVWX5ABCDEFGHIJKLMNOPQRSTUVWX6ABCDEFGHIJKLMNOPQRSTUVWX7ABCDEFGHIJKLMNOPQRSTUVWX'
                },
                {
                    name: 'Рабочие часы в будние дни',
                    model: '1JKLMNOPQRS2JKLMNOPQRS3JKLMNOPQRS4JKLMNOPQRS5JKLMNOPQRS'
                },
                {
                    name: 'Будние дни, круглосуточно',
                    model: '1ABCDEFGHIJKLMNOPQRSTUVWX2ABCDEFGHIJKLMNOPQRSTUVWX3ABCDEFGHIJKLMNOPQRSTUVWX4ABCDEFGHIJKLMNOPQRSTUVWX5ABCDEFGHIJKLMNOPQRSTUVWX'
                },
                {
                    name: 'Пользовательские настройки',
                    model: '',
                    noclear: true
                }
            ],
            timeAdapter: defaultTimeAdapter,
            defaultButtonSelected: 1,
            reload: true,
            spacing: [4, 6],
            extended: true,
            extendedTitle: 'Ставка',
            extendedValues: [100,90,80,70,60,50,40,30,20,10,0],
            extendedDefaultValue: 100,
            onChange: function () {
                console.log('model changed');
            },
            onInit: function () {
                console.log('component init');
            }
};
```

Time targeting model
*[y][x] = value for extended and 1/0 for simple //Will be initialize after init

Time targeting (simple) options:
* days - y axis;
* hours - x axis;
* buttons - array of objects {name: 'button-name', model: 'external model', noclear: 'if true - button will not clear time targeting area'}
* timeAdapter - time adapter for convert model
* defaultButtonSelected - index of default selected button
* reload - show clear button
* spacing - array of indexes of y axis for indent
* onChange: callback call when model changed
* onInit: callback call when component init

Time targeting (extended) options:
* extended - true/false - is component extended
* extendedTitle - title of extended values
* extendedValues - options for model
* extendedDefaultValue - default selected option