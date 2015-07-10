/**
 * Define blacklist properties
 */
const blacklist = {
  staticProps: [
    'length',
    'name',
    'arguments',
    'caller',
    'prototype'
  ],
  prototypeProps: [
    'constructor'
  ]
};


/**
 * Export properties enumerability enforcer utility
 */
export default function ensurePropsEnumerability(Class) {
  // Static properties
  Object.getOwnPropertyNames(Class)
    .filter((propName) => blacklist.staticProps.indexOf(propName) === -1)
    .forEach((propName) => Object.defineProperty(Class, propName, {enumerable: true}));

  // Prototype proerties
  Object.getOwnPropertyNames(Class.prototype)
    .filter((propName) => blacklist.prototypeProps.indexOf(propName) === -1)
    .forEach((propName) => Object.defineProperty(Class.prototype, propName, {enumerable: true}));
}
