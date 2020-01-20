const getPostLoginURI = () => {
  const middleware = (req, res, next) => {
    if (
      process &&
      process.env &&
      process.env.NODE_ENV &&
      process.env.NODE_ENV === "development"
    ) {
      res.locals.postLoginURI = "http://localhost:3000?";
    } else {
      res.locals.postLoginURI = "https://passover.lol?";
    }
    res.locals.postLoginURI =
      res.locals.postLoginURI +
      encodeURIComponent(
        `nickname=${res.locals.nickname}&email=${res.locals.email}`
      ) +
      "#/logging-in";
    return next();
  };
  return middleware;
};
module.exports = getPostLoginURI;
