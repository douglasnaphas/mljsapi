/**
 * Return middleware that sends 400 with "bad request" if roomcode and gamename
 * are not supplied as URL query params.
 */
function checkParams() {
  const api = require('../../api');
  const responses = require('../../responses');
  const middleware = (req, res, next) => {
    if(!req.query[api.ROSTER.PARAMS.ROOM_CODE] ||
       !req.query[api.ROSTER.PARAMS.GAME_NAME]) {
         return res.status(400).send(responses.BAD_REQUEST);
       }
    return next();  
  };
  return middleware;
}
module.exports = checkParams;