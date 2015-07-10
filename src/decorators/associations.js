/**
 * Define constants
 */
const symbol = Symbol('associations');

/**
 * Define association decorator creator
 */
const createDecorator = (decoratorName) => (target, options = {}) => (Model) => {

  // Ensure target exists
  if (typeof target !== 'string' || target === '') {
    throw new Error(`Target model name is missing for "${decoratorName}" association.`);
  }

  const associations = Model.prototype[symbol] = Model.prototype[symbol] || [];

  // Store association in prototype
  associations.push({method: decoratorName, target, options});

  return Model;
};


/**
 * Create decorators
 */
const hasOne = createDecorator('hasOne');
const hasMany = createDecorator('hasMany');
const belongsTo = createDecorator('belongsTo');
const belongsToMany = createDecorator('belongsToMany');


/**
 * Export associations decorators
 */
export {
  hasOne,
  hasMany,
  belongsTo,
  belongsToMany,
  symbol
};
