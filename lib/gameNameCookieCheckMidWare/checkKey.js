const schema = require('../../schema');
const getHash = require('../getHash');
const responses = require('../../responses');

/**
 * Return middleware satisfying:
 * - if res.locals.gameNameCookie[hash of res.locals.gameName] ==
 *      res.locals.dbData.Items[0][schema.SESSION_KEY], then
 *   call next()
 * - if there is no Items[0], send 403
 * - if either locals property is not set, send 500
 * - if the values do not match, send 403
 * - send 500 on other error
 * 
 * The middleware requires:
 * - res.locals.gameName is set to the Game Name
 * - res.locals.gameNameCookie[lowercase SHA-256 hash of the Game Name] is set
 *   to the session key from the cookie
 * - res.locals.dbData.Items is an array
 */
function checkKey() {
  const middleware = (req, res, next) => {
    if(!res.locals.gameNameCookie || !res.locals.dbData ||
      !res.locals.dbData.Items || !Array.isArray(res.locals.dbData.Items) ||
      !res.locals.gameName) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    if(res.locals.dbData.Items.length == 0) {
      console.log('******* no Items');
      return res.status(403).send(responses.FORBIDDEN);
    }
    const gameNameHash = getHash(res.locals.gameName);
    if(!res.locals.gameNameCookie[gameNameHash]) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    if(res.locals.gameNameCookie[gameNameHash] !=
       res.locals.dbData.Items[0][schema.SESSION_KEY]) {
      console.log('******* wrong cookie');
      console.log('res.locals.gameNameCookie');
      console.log(res.locals.gameNameCookie);
      console.log('res.locals.gameNameCookie[gameNameHash]');
      console.log(res.locals.gameNameCookie[gameNameHash]);
      console.log(res.locals.dbData.Items[0]);
      console.log(res.locals.dbData.Items[0][gameNameHash]);
      return res.status(403).send(responses.FORBIDDEN);
    }
    return next();
  }
  return middleware;
}
module.exports = checkKey;