const sedersResponse = () => {
  const middleware = (req, res, next) => {
    if(res.locals.dbDataSeders) {
      return res.send(res.locals.dbDataSeders);
    }
    throw {
      message: `sedersResponse: no data`,
      dbErrorSeders: res.locals.dbErrorSeders,
      dbError: res.locals.dbError,
      dbData: res.loals.dbData
    }
  };
  return middleware;
}
module.exports = sedersResponse;