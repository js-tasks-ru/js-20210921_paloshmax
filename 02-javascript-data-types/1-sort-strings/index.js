/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = "asc") {
  let resultArr = [...arr];
  let vector = param === "asc" ? 1 : param === "desc" ? -1 : null;
  return resultArr.sort(
    (a, b) => a.localeCompare(b, undefined, { caseFirst: "upper" }) * vector
  );
}
