const flagAuthedRequests = () => {
  const middleware = (req, res, next) => {
    const logger = require("../logger");
    const responses = require("../responses");
    if(!req.query.user) return next();
    if(typeof req.query.user !== 'string' || req.query.user.length < 5) {
      // minumum length 5: a@b.c
      logger.log(`flagAuthedRequests: non-string user, should be an email` +
        ` address`);
      return res.status(400).send(responses.BAD_REQUEST);
    }
    res.locals.user = req.query.user;
    return next();
  };
  return middleware;
};
module.exports = flagAuthedRequests;
