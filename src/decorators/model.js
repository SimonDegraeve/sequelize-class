const blacklist = {
  constructorProps: [
    'length',
    'name',
    'arguments',
    'caller',
    'prototype'
  ],
  prototypeProps: [
    'constructor'
  ],
  hookProps: [
    'beforeValidate',
    'afterValidate',
    'beforeBulkCreate',
    'beforeBulkDestroy',
    'beforeBulkUpdate',
    'afterBulkCreate',
    'afterBulkDestory',
    'afterBulkUpdate',
    'beforeCreate',
    'beforeDestroy',
    'beforeUpdate',
    'afterCreate',
    'afterDestroy',
    'afterUpdate'
  ]
};


export default function model() {

  // Return decorated Model
  return (Model) => {

    // Ensure constructor properties are enumerable
    // to access props in parent class
    Object.getOwnPropertyNames(Model)
      .filter((prop) => blacklist.constructorProps.indexOf(prop) === -1)
      .forEach((prop) => Object.defineProperty(Model, prop, {enumerable: true}));

    // Ensure prototype properties are enumerable
    // to access props in parent class
    Object.getOwnPropertyNames(Model.prototype)
      .filter((prop) => blacklist.prototypeProps.indexOf(prop) === -1)
      .forEach((prop) => Object.defineProperty(Model.prototype, prop, {enumerable: true}));

    // Set "definition" getter
    // to create Seqelize Model Definition and return arguments for "Sequelize.define" function
    // See http://sequelize.readthedocs.org/en/latest/docs/models-definition/
    Object.defineProperty(Model.prototype, 'definition', {
      get() {

        // Set defaults
        const modelName = this.constructor.name;
        const attributes = {};
        const options = {classMethods: {}, instanceMethods: {}, hooks: {}};

        // Iterate over constructor properties
        for (const prop in this.constructor) {
          // Convert all functions as "classMethods" or "hooks"
          if (typeof this.constructor[prop] === 'function') {
            if (blacklist.hookProps.indexOf(prop) === -1) {
              options.classMethods[prop] = this.constructor[prop];
            }
            else {
              options.hooks[prop] = this.constructor[prop];
            }
          }
          // Convert the rest as "options"
          else {
            options[prop] = this.constructor[prop];
          }
        }

        // Iterate over instance properties
        for (const prop in this) {
          // Convert all functions as "instanceMethods"
          if (typeof this[prop] === 'function') {
            options.instanceMethods[prop] = this[prop];
          }
          // Convert the rest as "attributes"
          else {
            attributes[prop] = this[prop];
          }
        }

        // Return list of arguments for "sequelize.define" function
        return [modelName, attributes, options];
      }
    });

    return Model;
  };
}

