const dbParams = require('./dbParams');
const awsSdk = require('aws-sdk');
const runTransactWrite = require('../runTransactWrite');
const handleQueryErrors = require('../handleQueryErrors');
const responses = require('../../responses');

/**
 * Set closed to true for this seder.
 */
const closeSederMiddleware = [
  // set db params
  dbParams(),
  // run query
  runTransactWrite(awsSdk, 'closeSederDbParams'),
  // handle query errors
  handleQueryErrors(),
  // send 200
  (req, res) => {res.send(responses.success())}
];
module.exports = closeSederMiddleware;