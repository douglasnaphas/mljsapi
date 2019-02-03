function pathCheck() {
  const middleware = (req, res, next) => {
    res.status(400).send();
  }
  return middleware;
}
module.exports = pathCheck;