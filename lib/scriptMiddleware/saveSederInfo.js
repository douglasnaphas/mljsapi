/**
 * pre:
 *   1) res.locals.dbData.Items is an array
 *   2) Items contains an entry with path and script_version properties
 *   3) Items contains one or more other entries, each of which is either {} or
 *      is an object with an answers property, which is set to an array of
 *      objects with 
 * Set
 *   res.locals.path
 *   res.locals.version
 *   res.locals.answers
 * Based on
 *   res.locals.dbData.Items
 */
function saveSederInfo() {
  const middleware = (req, res, next) => {
    const responses = require('../../responses');
    if(!res.locals.dbData) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
  };
  return middleware;
}
module.exports = saveSederInfo;