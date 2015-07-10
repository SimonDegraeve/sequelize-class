/**
 * Import dependencies
 */
import Sequelize from 'sequelize';

/**
 * Define constants
 */
const symbol = Symbol('queue');


/**
 * Define associate hook
 */
const associate = (Model) => {
  // Get models
  const {models} = Model.sequelize;

  // Get queue
  const queue = Model.sequelize[symbol] = Model.sequelize[symbol] || [];

  // Get associations
  const associations = Model.options.associationsQueue;

  // Handle queue
  let it = queue.length;
  while (it--) {
    const {method, source, target, options} = queue[it];

    if (Model.name === target) {
      queue.splice(it, 1);
      models[source][method](models[target], options);
    }
  }

  // Handle associations
  it = associations.length;
  while (it--) {
    const {method, source = Model.name, target, options} = associations[it];

    if (models[target]) {
      associations.splice(it, 1);
      models[source][method](models[target], options);
    }
    else {
      queue.push({method, source, target, options});
    }
  }
};


/**
 * Define Sequelize wrapper
 */
class SequelizeWrapper {
  constructor(...args) {
    // Create Sequelize instance
    const sequelize = new Sequelize(...args);

    // Add hook to create associations
    sequelize.addHook('afterDefine', associate);

    // Return sequelize instance
    return sequelize;
  }
}

/**
 * Export Sequelize wrapper and hook
 */
export {
  SequelizeWrapper as default,
  SequelizeWrapper,
  associate
};
