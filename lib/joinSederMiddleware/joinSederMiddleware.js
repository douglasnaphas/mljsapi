const checkBody = require('../checkBody');
const joinSederMiddleware = [
  // check for required body params
  checkBody('roomCode', 'gameName')
  // compute game name session key
  // create query params
  // execute query
  // compute cookie name
  // compute cookie value
  // set cookie
  // send
];
module.exports = joinSederMiddleware;