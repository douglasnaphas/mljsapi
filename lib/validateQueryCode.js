const validateQueryCode = code => {
  const middleware = (req, res, next) => {
    const codeRegex = /[^-a-z0-9A-Z_]/;
    if (typeof code !== "string" || codeRegex.test(code)) {
      return res.sendStatus(400);
    }
    return next();
  };
  return middleware;
};
module.exports = validateQueryCode;
