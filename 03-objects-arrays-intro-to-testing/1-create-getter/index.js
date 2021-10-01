/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  if (typeof path !== "string" || path[0] === ".") return null;
  return function (obj) {
    let pointer = 0;
    for (let i = 0; i <= path.length; i++) {
      if (path[i] === "." || i === path.length) {
        if (!(obj = obj[path.slice(pointer, i)])) return;
        pointer = ++i;
      }
      if (path[i] === "." && path[i + 1] === ".") {
        break;
      }
    }
    return obj;
  };
}
