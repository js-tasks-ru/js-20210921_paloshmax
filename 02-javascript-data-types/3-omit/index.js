/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  let tempObj = Object.assign({}, obj);
  fields.reduce((acc, item) => {
    if (Object.hasOwnProperty.call(tempObj, item)) delete tempObj[item];
    return acc;
  }, {});
  return tempObj;
};
