# sequelize-class
[![Maintenance Status][status-image]][status-url] [![Dependency Status][deps-image]][deps-url] [![NPM version][npm-image]][npm-url]

Define [Sequelize](http://docs.sequelizejs.com/en/latest/) models with JavaScript ES6 `classes` and ES7 `decorators`.

## Contents

- [Installation](#installation)
- [Explanation](#explanation)
- [Documentation](#documentation)
- [Examples](#examples)


## Installation

```js
npm install sequelize-class
```

## Explanation

`sequelize-class` creates a sequelize model definition from a class where:
- All `non-function` properties are converted into `attributes`.
- All `function` properties are converted into `instance methods`.
- All `static non-function` properties are converted into `options`.
- All `static function` properties are converted into `class methods` or `hooks`.

Notes:
- You should not use the `shorthand function syntax` to define instance methods inside the constructor.
  This would bind the method to the model definition instance instead of the sequelize model instance.
- You should always use an `object` to define an `attribute`.

  ```js
  // Will be converted to an instance method since "DataTypes.STRING" is a function
  this.attribute1 = DataTypes.STRING;

  // Instead use an object
  this.attribute1 = {
    type: DataTypes.STRING
  };
  ```

## Documentation

### Decorators

#### model()

Decorate a `Model Definition` class.

```js
import {model} from 'sequelize-class';

@model()
class MyModel {

}

// Get the model definition from the class
const myModelDefinition = new MyModel().definition;
// myModelDefinition === ['MyModel', {}, {}]

// ... instantiate sequelize

sequelize.define(...myModelDefinition);
```

The decorator adds a `definition` property to the class and normalize the model definition to be compatible with sequelize.
This property returns a list of argument which can be used by `sequelize.define` function.

#### hasOne(name, [options])

Decorate a `Model Definition` class where:

- `name` - the target model name.
- `options` - optional association settings.
See the [sequelize documentation](http://sequelize.readthedocs.org/en/latest/docs/associations) for all available options.

```js
import {model, hasOne} from 'sequelize-class';

@model()
@hasOne('MyAssociatedModel')
class MyModel {

}
```

The decorator adds a `relationships` property to the class.
This property stores the relationships (later used by the `associate` function).

#### belongsTo(name, [options])

Decorate a `Model Definition` class where:

- `name` - the target model name.
- `options` - optional association settings.
See the [sequelize documentation](http://sequelize.readthedocs.org/en/latest/docs/associations) for all available options.

```js
import {model, belongsTo} from 'sequelize-class';

@model()
@belongsTo('MyAssociatedModel')
class MyModel {

}
```

The decorator adds a `relationships` property to the class.
This property stores the relationships (later used by the `associate` function).

#### hasMany(name, [options])

Decorate a `Model Definition` class where:

- `name` - the target model name.
- `options` - optional association settings.
See the [sequelize documentation](http://sequelize.readthedocs.org/en/latest/docs/associations) for all available options.

```js
import {model, hasMany} from 'sequelize-class';

@model()
@hasMany('MyAssociatedModel')
class MyModel {

}
```

The decorator adds a `relationships` property to the class.
This property stores the relationships (later used by the `associate` function).

#### belongsToMany(name, [options])

Decorate a `Model Definition` class where:

- `name` - the target model name.
- `options` - optional association settings.
See the [sequelize documentation](http://sequelize.readthedocs.org/en/latest/docs/associations) for all available options.

```js
import {model, belongsToMany} from 'sequelize-class';

@model()
@belongsToMany('MyAssociatedModel')
class MyModel {

}
```

The decorator adds a `relationships` property to the class.
This property stores the relationships (later used by the `associate` function).

### Methods

#### associate(models)

Create the associations between the models where:
- `models` - an array of sequelize models.

Note: This function should be call after that every models has been defined.

```js
import {model, associate} from 'sequelize-class';

@model()
class MyModel {

}

// ... instantiate sequelize

sequelize.define(...new MyModel().definition);

associate(sequelize.models);
```

### Shortcuts

This module exports also the `Sequelize` constructor and the `DataTypes` object from the `sequelize` package. These are only provided as a shortcuts and are not modified by this module.

## Examples

```js
/**
 * Import dependencies
 */
import {
  model,
  associate,
  hasMany,
  belongsTo,
  Sequelize,
  DataTypes
} from 'sequelize-class';


/**
 * Define models
 */
@model()
class MyBasicModel {

  // Using constructor
  constructor() {
    // All non-function properties are converted into attributes
    this.attribute1 = {
      type: DataTypes.STRING
    };

    // All function properties are converted into instance methods
    this.instanceMethod1 = function () {
      return this.getDataValue('attribute1');
    };
    // /!\ You should not use the function shorthand syntax
    // This syntax would bind the method to the model definition instance
    // instead ot the sequelize model instance
  }

  // Or using property initializers
  attribute1 = {
    type: DataTypes.STRING
  }

  instanceMethod1() {
    return this.getDataValue('attribute1');
  }
}

@model()
class MyModelWithStatics {

  // All static non-function properties are converted into options
  static paranoid = true;
  static tableName = 'my_very_custom_table_name';
  static indexes = [{
    unique: true,
    fields: ['attribute1']
  }];


  // All static functions properties are converted into class methods or hooks
  static myClassMethod1() {
    return 'I am a class method';
  }

  // Hook list:
  // beforeValidate, afterValidate, beforeBulkCreate, beforeBulkDestroy, beforeBulkUpdate,
  // afterBulkCreate, afterBulkDestory, afterBulkUpdate, beforeCreate, beforeDestroy, beforeUpdate,
  // afterCreate, afterDestroy, afterUpdate
  static beforeCreate() {
    return 'I am a hook';
  }

  attribute1 = {
    type: DataTypes.STRING
  }
}

@model()
class MyParentModel {

  attribute1 = {
    type: DataTypes.STRING
  }

  instanceMethod1() {
    this.getDataValue('attribute1');
  }
}

@model()
class MyExtendedModel extends MyParentModel { // Works with class inheritance

  attribute2 = {
    type: DataTypes.STRING
  }

  instanceMethod2() {
    this.getDataValue('attribute2');
  }
}

@model()
@hasMany('MyStuffModel', {foreignKey: 'fk_model_id'})
class MyModelWithManyStuff {

}

@model()
@belongsTo('MyModelWithManyStuff', {as: 'Stuff'})
class MyStuffModel {

}


/**
 * Set up Seqelize
 */
const sequelize = new Sequelize('databaseName', 'user', 'password');

sequelize.define(...new MyBasicModel().definition);
sequelize.define(...new MyModelWithStatics().definition);
sequelize.define(...new MyExtendedModel().definition);
sequelize.define(...new MyModelWithManyStuff().definition);
sequelize.define(...new MyStuffModel().definition);

associate(sequelize.models);


/**
 * Do something with the database
 */
(async function () {
  try {
    const {MyBasicModel} = sequelize.models;

    await sequelize.sync({force: true});

    const myBasicModel = await MyBasicModel.create({
      attribute1: 'value1'
    });

    console.log(myBasicModel.instanceMethod1()); // Print: 'value1'
  }
  catch (error) {
    console.error(error);
  }
}());
```


## Licence

The MIT License (MIT)

Copyright (c) 2015 Simon Degraeve

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[npm-url]: https://npmjs.org/package/sequelize-class
[npm-image]: http://img.shields.io/npm/v/sequelize-class.svg?style=flat-square

[deps-url]: https://david-dm.org/SimonDegraeve/sequelize-class
[deps-image]: https://img.shields.io/david/SimonDegraeve/sequelize-class.svg?style=flat-square

[status-url]: https://github.com/SimonDegraeve/sequelize-class/pulse
[status-image]: http://img.shields.io/badge/status-maintained-brightgreen.svg?style=flat-square
