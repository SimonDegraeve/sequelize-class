/**
 * Import dependencies
 */
import sequelizeHooks from 'sequelize/lib/hooks';
import arrayify from 'arrayify-compact';


/**
 * Define constants
 */
const hookNames = [
  ...Object.keys(sequelizeHooks.hooks),
  ...Object.keys(sequelizeHooks.hookAliases)
];


/**
 * Export base options getter
 */
export default function getBaseOptions(Class) {
  // Define options
  const options = {
    hooks: {},
    classMethods: {},
    instanceMethods: {}
  };

  // Iterate over static properties
  for (const propertyName in Class) {
    // Convert matching hook name into hook options
    if (hookNames.indexOf(propertyName) !== -1) {
      options.hooks[propertyName] = arrayify([
        options.hooks[propertyName],
        Class[propertyName]
      ]);
    }
    // Convert function into class method options
    else if (typeof Class[propertyName] === 'function') {
      options.classMethods[propertyName] = Class[propertyName];
    }
  }

  // Iterate over prototype properties
  for (const propertyName in Class.prototype) {
    // Convert function into instance method options
    if (typeof Class.prototype[propertyName] === 'function') {
      options.instanceMethods[propertyName] = Class.prototype[propertyName];
    }
  }

  // Return options
  return options;
}
