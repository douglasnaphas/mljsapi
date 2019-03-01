/**
 * Return middleware satisfying:
 * pre: req.query.roomcode and req.query.gamename are set to Strings
 * post: res.locals.rosterDbParams is set to an object that will work as params
 * to DynamoDB's DocumentClient.query(), to retrieve participants' Game Names
 * @return Express middleware that sets res.locals.rosterDbParams based on
 * req.query.roomcode and req.query.gamename, or sends 500 on error
 */
function dbParams() {
  const responses = require('../../responses');
  const middleware = (req, res, next) => {
    if(!req.query.roomcode || !req.query.gamename) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
  };
  return middleware;
}
module.exports = dbParams;