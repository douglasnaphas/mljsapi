const Configs = require('../../Configs');
const randomCapGenerator = require('../randomCapGenerator');

const checkBody = require('../checkBody');
const computeGameNameSessionKey = require('./computeGameNameSessionKey');

const joinSederMiddleware = [
  // check for required body params
  checkBody('roomCode', 'gameName'),
  // compute game name session key
  computeGameNameSessionKey(randomCapGenerator, Configs)
  // hash game name
  // create db query params
  // execute query
  // compute cookie name
  // compute cookie value
  // set cookie
  // send
];
module.exports = joinSederMiddleware;