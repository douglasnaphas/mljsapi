const s3Params = require('./s3Params');
const awsSdk = require('aws-sdk');
const runS3Get = require('../runS3Get');
const handleS3Errors = require('../handleS3Errors');
const scriptInfo = require('./scriptInfo');
const dbParamsGetParticipants = require('./dbParamsGetParticipants');
const runQuery = require('../runQuery');
const handleQueryErrors = require('../handleQueryErrors');

/**
 * pre: req.body[api.POST_BODY_PARAMS.PATH] is set
 * post:
 *   1) libs are assigned in the database
 *   2) the seder in the database is updated with the script version
 */
const assignLibsMiddleware = [
  // set s3 params
  s3Params(),
  // run s3 get
  runS3Get(awsSdk, 'assignLibsS3Params'),
  // handle s3 errors
  handleS3Errors(),
  // save script info
  scriptInfo(),
  // set db params to get all participant sort keys
  dbParamsGetParticipants(),
  // run query
  runQuery(awsSdk, 'getParticipantsDbParams'),
  // handle query errors
  handleQueryErrors(),
  // save participants
  (req, res, next) => {res.locals.participants = res.locals.dbData.Items;
    return next();},
  // compute lib assignments
  
  // reset dbData, dbError
  // (req, res, next) => {res.locals.dbData = undefined; res.locals.dbError = 
  //   undefined; return next();}
  // set db params to
  //   - note the version of the script
  //   - assign libs, using repeated-if-necessary transactWrite calls to the
  //     participant items
  
  // run query
  
  // handle db errors
  
  // next
];
module.exports = assignLibsMiddleware;