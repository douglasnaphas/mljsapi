const checkQueryParams = require('../checkQueryParams');
const api = require('../../api');
const dbParams = require('./dbParams');
const runQuery = require('../runQuery');
const awsSdk = require('aws-sdk');
const handleQueryErrors = require('../handleQueryErrors');
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
  checkQueryParams([api.URL_QUERY_PARAMS.ROOM_CODE,
    api.URL_QUERY_PARAMS.GAME_NAME]),
  // set db query params to get assignments
  dbParams(),
  // run db query
  runQuery(awsSdk, 'assigmentsDbParams'),
  // handle db errors
  handleQueryErrors(),
  // prepare response
  
  // send
  (req, res) => {res.send({err: res.locals.dbError, data: res.locals.dbData})}
];
module.exports = assignmentsMiddleware;