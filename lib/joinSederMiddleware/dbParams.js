/**
 * Return middleware satisfying:
 * pre: req.body.roomCode, req.body.gameName, and res.locals.gameNameSessionKey
 * are set to Strings
 * post: res.locals.joinSederDbParams is set to an object that will work as
 * params to DynamoDB's transactWrite, to:
 *   1) fail if the roomCode does not correspond to an existing un-expired
 *   seder,
 *   2) fail if a participant with the requested Game Name is already at the
 *   seder, or
 *   3) write the requested Game Name into the seders table with the
 *   gameNameSessionKey otherwise
 * @param {Date} now A Date object that the max seder age will count back from
 * @param {Object} configs An object with a function msToJoinSeder that returns
 * the number milliseconds players have to join seders
 * @return Express middleware that sets res.locals.joinSederDbParams based on
 * req.body and res.locals and calls next, or sends 500 on error
 */
function dbParams(now, configs) {
  
}

module.exports = dbParams;