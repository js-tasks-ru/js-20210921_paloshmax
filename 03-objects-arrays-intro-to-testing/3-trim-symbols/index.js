/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size == null) return string;
  let result = "";
  let activeChar;
  let pointer;
  for (const char of string) {
    if (char !== activeChar) {
      activeChar = char;
      pointer = 0;
    }
    if (pointer++ < size) {
      result += char;
    }
  }
  return result;
}
