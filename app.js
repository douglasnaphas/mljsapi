var express = require('express');
var os = require('os');
var Configs = require('./Configs');
var app = express();

function addCors(req, res) {
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
}

app.get('/', function(req, res) {
  addCors(req, res);
  res.send({
    Output:
      'Hello World!!' +
      ' ' +
      app.get('ip') +
      ' ' +
      app.get('port') +
      ' ' +
      (process && process.env && process.env.NODE_ENV
        ? process.env.NODE_ENV
        : 'no NODE_ENV') +
      ' ',
    theEnv: process.env
  });
});

app.post('/', function(req, res) {
  res.send({
    Output: 'Hello World!! ' + os.hostname()
  });
});

app.get('/public-endpoint', function(req, res) {
  addCors(req, res);
  res.send({
    Output: 'this endpoint is public'
  });
});

app.get('/protected-endpoint', function(req, res) {
  res.send({
    Output: 'this endpoint is protected'
  });
});

// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app;
