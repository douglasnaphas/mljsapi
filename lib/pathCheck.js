function pathCheck(options) {
  const pathRegex = (options && options.pathRegex) || /^[-a-zA-Z0-9/_]+$/;
  const middleware = (req, res, next) => {
    if(! req ||
       ! req.body ||
       ! req.body.path ||
       ! req.body.path.match(pathRegex)) {
      res.status(400).send();
    }
    next();
  }
  return middleware;
}
module.exports = pathCheck;