/**
 * Return middleware satisfying:
 * pre: req.body.X is defined for each X in expectedBodyParams
 * post: next is called
 * @return {Function} Express middleware that calls next if all the specified
 * params appear in the request body, sends 400 otherwise
 * @param {Array} expectedBodyParams List of values that must be present on the
 * request body
 */
function checkBody(expectedBodyParams) {
  const middleware = (req, res, next) => {
    if(!req.body) {
      return res.status(400).send();
    }
    expectedBodyParams.forEach(e => {
      if(!req.body.hasOwnProperty(e) && !req.body[`${e}`]) {
        return res.status(400).send();
      }
    });
    return next();
  };
  return middleware;
}

module.exports = checkBody;