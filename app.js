const bodyParser = require('body-parser');
var express = require('express');
var Configs = require('./Configs');
var app = express();
var credChecker = require('./lib/credChecker');
var cookieParser = require('cookie-parser');
const AWS = require('aws-sdk');

const joinSeder = require('./lib/joinSeder');
const pathCheck = require('./lib/pathCheck');
const roomCode = require('./lib/room-code');
const roomCodeExists = require('./lib/roomCodeExists');
const randomStringGenerator = require('./lib/randomCapGenerator');
const schema = require('./schema');
const blacklistPostParams = require('./lib/blacklistPostParams');
const gameNameCookieCheckMidWare =
  require('./lib/gameNameCookieCheckMidWare/gameNameCookieCheckMidWare.js');
const responses = require('./responses');
const assignLibsMiddleware =
  require('./lib/assignLibsMiddleware/assignLibsMiddleware.js');
const assignmentsMiddleware =
  require('./lib/assignmentsMiddleware/assignmentsMiddleware.js');
const submitLibsMiddleware =
  require('./lib/submitLibsMiddleware/submitLibsMiddleware.js');
const readRosterMiddleware =
  require('./lib/readRosterMiddleware/readRosterMiddleware.js');
const scriptMiddleware =
  require('./lib/scriptMiddleware/scriptMiddleware');

app.use(function(req, res, next) {
  res.set({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process &&
      process.env &&
      process.env.NODE_ENV &&
      process.env.NODE_ENV === 'development'
      ? req.get('origin')
      : Configs.allowedOrigin(req.get('origin')),
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Credentials': 'true'
  });
  next();
});

app.use(cookieParser());

// app.use(credChecker({}));

app.options(/\/.*/, function(req, res) {
  res.status(204).send();
});

app.get('/', function(req, res) {
  const dynamodb = new AWS.DynamoDB();
  const params = {
    TableName: 'seders'
  };
  dynamodb.describeTable(params, (err, data) => {
    if (err) {
      console.log('***** error occurred describing table');
      console.log(err, err.stack);
      res.send({ err: err, stack: err.stack });
    } // an error occurred
    else {
      console.log('###### successfully described table');
      console.log(data);
      res.send({ Output: data });
    }
  });
});

app.post('/', function(req, res) {
  res.send({
    Output: 'Hello World!! '
  });
});

app.get('/public-endpoint', function(req, res) {
  res.send({
    Output: 'this endpoint is public'
  });
});

app.get('/protected-endpoint', function(req, res) {
  res.send({
    Output: 'this endpoint is protected'
  });
});

// TODO: check the JWT and send cookies
app.get(
  '/get-cookies',
  function(req, res, next) {
    res.send({ Output: 'nothing' });
  },
  function() {}
);

app.get('/playground', function(req, res, next) {
  let authHeader;
  authHeader = req.get('authorization');
  authHeader = authHeader || 'no auth header';
  res.send({ Authorization: authHeader });
});

app.get('/code', function(req, res) {});

app.get('/scripts', async function(req, res) {
  const params = {
    TableName: schema.TABLE_NAME,
    IndexName: schema.SCRIPTS_INDEX,
    ExpressionAttributeNames: {
      '#IS': schema.SCRIPTS_PART_KEY
    },
    ExpressionAttributeValues: {
      ':is': 1
    },
    KeyConditionExpression: '#IS = :is'
  };
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const dbResponse = await new Promise((resolve, reject) => {
    dynamodb.query(params, (err, data) => {
      resolve({err: err, data: data});
    });
  });
  if(dbResponse.err) {
    return res.status(500).send({err: dbResponse.err});
  }
  return res.send({scripts: dbResponse.data});
});

app.use(bodyParser.json());

app.use(blacklistPostParams);

app.use('/room-code', pathCheck());
app.post('/room-code', roomCode(AWS, randomStringGenerator));

const joinSederMiddleware =
  require('./lib/joinSederMiddleware/joinSederMiddleware.js');
app.post('/join-seder', joinSederMiddleware);

const rosterMiddleware = require('./lib/rosterMiddleware/rosterMiddleware.js');
app.get('/roster', gameNameCookieCheckMidWare, rosterMiddleware);

const closeSederMiddleware =
  require('./lib/closeSederMiddleware/closeSederMiddleware.js');
app.post('/close-seder', gameNameCookieCheckMidWare, closeSederMiddleware,
  assignLibsMiddleware, (req, res) => {res.send(responses.success())});

app.get('/assignments', gameNameCookieCheckMidWare, assignmentsMiddleware);

app.post('/submit-libs', gameNameCookieCheckMidWare, submitLibsMiddleware,
  (req, res, next) => {return res.send({result: 'ok'})});
  
app.get('/read-roster', gameNameCookieCheckMidWare, readRosterMiddleware,
  (req, res) => {res.send({done: res.locals.done,
  notDone: res.locals.notDone})});

const db = require('./lib/dbPlayAssignLibs');
app.post('/db', db);
app.get('/db', db);

app.post('/play', readRosterMiddleware, (req, res) => {res.send({err:
  res.locals.dbError, data: res.locals.dbData})});
app.get('/play', scriptMiddleware, (req, res) => {
  res.send(res.locals.script)});


// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app;
