/**
 * Import dependencies
 */
import Joi from 'joi';


/**
 * Define constants
 */
const joiOptions = {
  convert: true,
  abortEarly: false,
  allowUnknown: true,
  skipFunctions: true,
  stripUnknown: false,
  presence: 'optional',
  context: {},
  language: {}
};


/**
 * Export Joi options getter
 */
export default function getJoiOptions() {
  // Define options
  const options = {
    classMethods: {},
    hooks: {}
  };

  // Add Joi schema getter
  options.classMethods.getJoiSchema = function () {
    return Object.keys(this.rawAttributes)
      .filter((key) => (this.rawAttributes[key].joi || {}).isJoi)
      .reduce((map, key) => ({...map, [key]: this.rawAttributes[key].joi}), {});
  };

  // Add validator hook
  options.hooks.beforeValidate = [function (model, config, callback) {
    Joi.validate(model.get(), model.Model.getJoiSchema(), joiOptions, (error, values) => {
      if (error) {
        throw error;
      }

      model.set(values, {reset: true});
      return callback();
    });
  }];

  // Return options
  return options;
}
