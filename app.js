var express = require('express');
var Configs = require('./Configs');
var app = express();
var credChecker = require('./lib/credChecker');
var cookieParser = require('cookie-parser');
const AWS = require('aws-sdk');

app.use(function(req, res, next) {
  res.set('Content-Type', 'application/json');
  res.set(
    'Access-Control-Allow-Origin',
    process &&
      process.env &&
      process.env.NODE_ENV &&
      process.env.NODE_ENV === 'development'
      ? req.get('origin')
      : Configs.allowedOrigin()
  );
  next();
});

app.use(cookieParser());

// app.use(credChecker({}));

app.options(/\/.*/, function(req, res) {
  res.set('Access-Control-Allow-Headers', 'Authorization');
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
  }); // successful response
  // res.send({
  //   Output: 'Hello World!!'
  // });
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

// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app;
