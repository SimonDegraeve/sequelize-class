/**
 * Import dependencies
 */
import DataTypes from 'sequelize/lib/data-types';


/**
 * Define constants
 */
const symbol = Symbol('attributes');

const typeKeys = [
  ...Object.keys(DataTypes),
  ...Object.keys(DataTypes).map(type => type.toLowerCase())
];

const whitelistKeys = [
  'type',
  'allowNull',
  'defaultValue',
  'unique',
  'primaryKey',
  'field',
  'autoIncrement',
  'comment',
  'references',
  'onUpdate',
  'onDelete',
  'get',
  'set',
  'validate',
  ...typeKeys,
  'joi',
  'faker'
];

const defaultValues = {
  allowNull: true,
  unique: true,
  primaryKey: true,
  autoIncrement: true
};


/**
 * Convert options into chainable decorator
 */
const attribute = whitelistKeys.reduce((map, key) => ({
  ...map,

  [key](...args) {
    // Get options
    const properties = Object.assign({}, this);
    const options = properties[symbol] = properties[symbol] || {};

    // Set data type options
    if (typeKeys.indexOf(key) !== -1) {
      options.type = DataTypes[key.toUpperCase()].bind(null, ...args);
    }
    // Set other options
    else {
      options[key] = typeof args[0] !== 'undefined' ? args[0] : defaultValues[key];
    }

    // Create decorator
    const decorator = (prototype, attributeName, descriptor) => {
      // Get property initializer
      const initializer = typeof descriptor.initializer === 'function' ?
        descriptor.initializer() :
        descriptor.initializer;

      // Set default value from initializer
      if (initializer !== null) {
        options.defaultValue = initializer;
        if (options.joi) {
          options.joi = options.joi.default(initializer, attributeName);
        }
      }

      // Store attribute options in prototype
      prototype[symbol] = {...prototype[symbol] || {}, [attributeName]: options};

      // Return property descriptor
      return descriptor;
    };

    // Return chainable decorator
    return Object.assign(decorator, properties);
  }
}), {});


/**
 * Export attribute decorator
 */
export {
  attribute as default,
  attribute,
  symbol
};
