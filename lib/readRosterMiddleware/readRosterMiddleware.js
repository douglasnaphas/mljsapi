const checkQueryParams = require('../checkQueryParams');
const api = require('../../api');

/**
 * pre:
 *   1) req.query.roomCode is set
 * post:
 *   1) A responses is sent with an array of 
 */
const readRosterMiddleware = [
  // check for req.body.roomCode
  checkQueryParams([api.URL_QUERY_PARAMS.ROOM_CODE])
  // set db params to get a list of participants and their answers
  
  // run query
  
  // handle query errors
  
  // prepare response: two lists, submitted and un-submitted
  
  // send
]

module.exports = readRosterMiddleware;