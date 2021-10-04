/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (typeof obj !== "object") return;
  return Object.entries(obj).reduce((acc, entry) => {
    return (acc[entry[1]] = entry[0]), acc;
  }, {});
}
