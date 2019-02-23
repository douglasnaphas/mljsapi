/**
 * return Middleware that sends 200 with
 *   {result: 'success',
 *    gameName: req.body.gameName,
 *    roomCode: req.body.roomCode},
 *  sends 500 otherwise.
 */
function succeed() {
  const middleware = (req, res) => {
    const responses = require('../../responses');
    if(!req.body || !req.body.roomCode || !req.body.gameName) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    return res.send(responses.success({
      gameName: req.body.gameName,
      roomCode: req.body.roomCode
    }))
  };
  return middleware;
}

module.exports = succeed;