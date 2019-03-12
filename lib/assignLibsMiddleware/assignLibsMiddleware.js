const s3Params = require('./s3Params');
const awsSdk = require('aws-sdk');
const runS3Get = require('../runS3Get');
const handleS3Errors = require('../handleS3Errors');
const scriptInfo = require('./scriptInfo');
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
  scriptInfo()
  // set db params to get all participant sort keys
  
  // run query
  
  // handle query errors
  
  // save participants
  
  // compute lib assignments
  
  // set db params to
  //   - note the version of the script
  //   - assign libs, using repeated-if-necessary transactWrite calls to the
  //     participant items
  
  // run query
  
  // handle db errors
  
  // next
];
module.exports = assignLibsMiddleware;