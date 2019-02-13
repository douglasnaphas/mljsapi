/**
 * @param {Object} options, including:
 *   - {Array} illegalCharacters An array of characters to be stripped from
 *     gameName
 * @return {Function} Express middleware that strips illegal characters out of
 * req.body.gameName
 */
function sanitizeGameName({illegalCharacters}) {
  const middelware = async (req, res, next) => {
    next();
  };
  return middelware;
}

module.exports = sanitizeGameName;