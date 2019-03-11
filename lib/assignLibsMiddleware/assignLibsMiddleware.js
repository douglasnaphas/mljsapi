const s3Params = require('./s3Params');
const awsSdk = require('aws-sdk');
const runS3Get = require('../runS3Get');
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
  runS3Get(awsSdk, 'assignLibsS3Params')
  // handle s3 errors
  
  // save script info
  
  // compute lib assignments
  
  // set db params to
  //   - note the version of the script
  //   - assign libs, using repeated-if-necessary transactWrite calls to the
  //     participant items
  
  // next
];
module.exports = assignLibsMiddleware;