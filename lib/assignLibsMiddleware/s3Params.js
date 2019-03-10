/**
 * Return middleware satisfying:
 * pre: req.body.scriptPath is set a String
 * post: res.locals['assignLibsS3Params'] is set to an object that will work as
 * params to S3's getObject, retrieve:
 *   1) The script content,
 *   2) The current script version
 */
function s3Params() {
  
}
module.exports = s3Params;