/**
 * @return middleware satisfying:
 *   pre: res.locals.id_token is set to a JWT
 *   post:
 */
const getUserInfo = jwt => {
  const middleware = (req, res, next) => {
    try {
      const decodedJot = jwt.decode(res.locals.id_token, { complete: true });
      res.locals.nickname = decodedJot.payload.nickname;
      res.locals.email = decodedJot.payload.email;
      return next();
    } catch (err) {
      console.log("getUserInfo: unable to get nickname/email");
      console.log(err);
      return res.sendStatus(500);
    }
  };
  return middleware;
};
module.exports = getUserInfo;
