/**
 * Export Faker options getter
 */
export default function getFakerOptions() {
  // Define options
  const options = {
    classMethods: {}
  };

  // Add Faker getter
  options.classMethods.getFakeAttributes = function (times) {
    function generate() {
      return Object.keys(this.rawAttributes)
        .filter((key) => typeof this.rawAttributes[key].faker === 'function')
        .reduce((map, key) => ({...map, [key]: this.rawAttributes[key].faker()}), {});
    }

    // Repeat
    if (times) {
      return Array.apply(null, new Array(times)).map(() => generate.call(this));
    }
    return generate.call(this);
  };

  // Return options
  return options;
}
