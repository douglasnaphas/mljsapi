const flagAuthedRequests = () => {
  const middleware = (req, res, next) => {
    const logger = require("../logger");
    const responses = require("../responses");
    if(!req.body || !req.body.user) return next();
    if(typeof req.body.user !== 'string') {
      logger.log(`flagAuthedRequests: non-string sub`);
      return res.status(400).send(responses.BAD_REQUEST);
    }
    res.locals.user = req.body.user;
    return next();
  };
  return middleware;
};
module.exports = flagAuthedRequests;
