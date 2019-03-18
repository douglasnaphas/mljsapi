/**
 * pre:
 *   1) req.query.roomcode is set
 *   2) req.query.gamename is set
 * post:
 *   A response is sent like
 *     {
 *        assignments: [
 *          {id: '..', prompt: '..', example: '..', sentence: '..'},
 *          ...
 *        ]
 *     }
 */
const assignmentsMiddleware = [
  // check for query params
  
  // set db query params to get assignments
  
  // run db query
  
  // handle db errors
  
  // prepare response
  
  // send
];
module.exports = assignmentsMiddleware;