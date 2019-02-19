/**
 * Return middleware satisfying:
 * pre: res.locals.gameNameHash and res.locals.gameNameSessionKey are set to
 * strings
 * post: A cookie is set with http-only, name: res.locals.gameNameHash, value:
 * res.locals.gameNameSessionKey
 */
function setCookie() {
  const middleware = (req, res, next) => {
    if(!res.locals.gameNameHash || !res.locals.gameNameSessionKey) {
      return res.status(500).send();
    }
    const cookieOptions = process.env.NODE_ENV === 'development' ?
      {httpOnly: true} : {httpOnly: true, secure: true};
    res.cookie(res.locals.gameNameHash, res.locals.gameNameSessionKey,
      cookieOptions);
    next();
  };
  return middleware;
}

module.exports = setCookie;