const checkParams = require('./checkParams');

/**
 * Return a sorted JSON array of the Game Names ofparticipants in this seder.
 * Send 400 with "bad request" if the seder does not exist or a cookie matching
 * the Game Name of the requestor in the query params is not supplied.
 */
const rosterMiddleware = [
  // check params
  checkParams(),
  // set db params
  
  // run query
  
  // handle errors from the query
  
  // sort the participants
  
  // success, send
];

module.exports = rosterMiddleware;