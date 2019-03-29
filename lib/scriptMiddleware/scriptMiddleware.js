const api = require('../../api');
const checkQueryParams = require('../checkQueryParams');
const querySederParams = require('./querySederParams');
const runQuery = require('../runQuery');
const awsSdk = require('aws-sdk');
const handleQueryErrors = require('../handleQueryErrors');

/**
 * pre:
 *   1) req.query.roomCode is set
 * post:
 *   1) res.locals.script is set to the script for this seder, populated with
 *      participants' answers
 */
const scriptMiddleware = [
  // make sure req.query.roomCode is set
  checkQueryParams([api.URL_QUERY_PARAMS.ROOM_CODE]),
  // set db params to get the path, version, and answers from every item with
  // this room code
  querySederParams(),
  // run query to get the path and version
  runQuery(awsSdk, 'querySederParams'),
  // handle query errors
  handleQueryErrors(),
  // save the path and version
  
  // save the answers
  
  // reset res.locals.dbError, dbData
  
  // set params to get the script from S3
  
  // run S3 get
  
  // handle S3 errors
  
  // save the script in res.locals.rawScript
  
  // set res.locals.script to the script with answers (no prompts, etc)

];
module.exports = scriptMiddleware;