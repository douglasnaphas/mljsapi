'use strict';

const supertest = require('supertest');
const unit = require('unit.js');
const app = require('../app.js');

const request = supertest(app);

describe('Tests app', function() {
  it.skip('verifies get', function(done) {
    request
      .get('/')
      .expect(200)
      .end(function(err, result) {
        unit.string(result.body.Output).contains('Hello');
        unit
          .value(result)
          .hasHeader('content-type', 'application/json; charset=utf-8');
        done(err);
      });
  });
  it('verifies post', function(done) {
    request
      .post('/')
      .expect(200)
      .end(function(err, result) {
        unit.string(result.body.Output).contains('Hello');
        unit
          .value(result)
          .hasHeader('content-type', 'application/json; charset=utf-8');
        done(err);
      });
  });
});
