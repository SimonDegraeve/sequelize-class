/**
 * Import dependencies
 */
import arrayify from 'arrayify-compact';
import merge from 'deepmerge';
import ensurePropsEnumerability from '../utils/ensurePropsEnumerability';

import getBaseOptions from '../options/getBaseOptions';
import getJoiOptions from '../options/getJoiOptions';
import getFakerOptions from '../options/getFakerOptions';

import {symbol as attributesSymbol} from './attribute';
import {symbol as associationsSymbol} from './associations';


/**
 * Define constants
 */
const optionsSymbol = Symbol('options');


/**
 * Define model decorator
 */
const model = (name, options = {}) => (Class) => {
  // Ensure name is defined
  if (typeof name !== 'string' || name === '') {
    throw new Error('Model name is missing.');
  }

  // Ensure static/prototype properties are enumerable
  ensurePropsEnumerability(Class);

  // Ensure hook options are arrays
  if (options.hooks) {
    options.hooks = Object.keys(options.hooks).reduce((map, key) => ({
      ...map, [key]: arrayify(options.hooks[key])
    }), {});
  }

  // Store associations in options
  options.associationsQueue = Class.prototype[associationsSymbol] || [];

  // Create options
  let opts = merge(options, getBaseOptions(Class));
  opts = merge(opts, getJoiOptions());
  opts = merge(opts, getFakerOptions());
  Class.prototype[optionsSymbol] = opts;

  // Create argument list
  const args = [name, Class.prototype[attributesSymbol], Class.prototype[optionsSymbol]];

  // Add access to internals
  Object.defineProperties(args, {
    name: {
      get: () => name
    },
    attributes: {
      get: () => Class.prototype[attributesSymbol]
    },
    options: {
      get: () => Class.prototype[optionsSymbol]
    }
  });

  // Return list of argument for "sequelize.define" function
  return args;
};


/**
 * Export model decorator
 */
export default model;
