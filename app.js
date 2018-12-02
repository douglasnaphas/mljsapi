var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send({
    Output: 'Hello World!'
  });
});

app.post('/', function(req, res) {
  res.send({
    Output: 'Hello World!'
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

// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app;
