/**
 * Return middleware satisfying:
 * pre: req.body.scriptPath is set a String
 * post: res.locals['assignLibsS3Params'] is set to an object that will work as
 * params to S3's getObject, retrieve:
 *   1) The script content,
 *   2) The current script version
 */
function s3Params() {
  const bucket = require('../../bucket');
  const responses = require('../../responses');
  const middleware = (req, res, next) => {
    if(!req.body.scriptPath) return res.status(400).send(responses.BAD_REQUEST);
    const s3Params = {
      Bucket: bucket.Bucket,
      Key: bucket.path2key(req.body.scriptPath)
    };
    res.locals.assignLibsS3Params = s3Params;
    next();
  };
  return middleware;
}
module.exports = s3Params;