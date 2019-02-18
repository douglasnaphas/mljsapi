const Configs = require('../../Configs');
const randomCapGenerator = require('../randomCapGenerator');
const getHash = require('../getHash');
const awsSdk = require('aws-sdk');

const checkBody = require('../checkBody');
const computeGameNameSessionKey = require('./computeGameNameSessionKey');
const hashGameName = require('./hashGameName');
const dbParams = require('./dbParams');
const runQuery = require('./runQuery');

const joinSederMiddleware = [
  // check for required body params
  checkBody('roomCode', 'gameName'),
  // compute game name session key
  computeGameNameSessionKey(randomCapGenerator, Configs),
  // hash game name
  hashGameName(getHash),
  // create db query params
  dbParams(new Date(), Configs),
  // execute query
  runQuery(awsSdk)
  // handle invalid or expired room codes, taken game names
  // compute cookie name
  // compute cookie value
  // set cookie
  // send
];
module.exports = joinSederMiddleware;