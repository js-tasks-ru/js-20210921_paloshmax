/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const list = new Set(fields);
  return Object.entries(obj).reduce((acc, { 0: propName, 1: value }) => {
    if (!list.has(propName)) acc[propName] = value;
    return acc;
  }, {});
};
