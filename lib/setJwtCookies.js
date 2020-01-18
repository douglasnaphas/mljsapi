const setJwtCookies = () => {
  const middleware = (req, res, next) => {
    ["id_token", "access_token", "refresh_token"].forEach(token => {
      res.cookie(token, res.locals[token], {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
      });
    });
    return next();
  };
  return middleware;
};
module.exports = setJwtCookies;
