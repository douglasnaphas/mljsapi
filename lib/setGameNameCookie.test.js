/* globals expect */
const setGameNameCookie = require('./setGameNameCookie');
const Configs = require('../Configs');

describe('setGameNameCookie', () => {
  const runTest = ({gameName, randomStringGenerator, expectedCookie,
    expectedStatus, expectNext}) => {
    const middleware = setGameNameCookie({configs: Configs,
      randomStringGenerator: randomStringGenerator});
    const req = {
      body: {
        gameName: gameName
      }
    };
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };
    const cookies = [];
    let sentStatus;
    const res = {
      cookie: (name, value, options) => {
        cookies.push({name: name, value: value, options: options});
      },
      status: (s) => {
        return {
          send: (data) => {
            sentStatus = s;
          }
        }
      },
    };
    middleware(req, res, next);
  };
  test('...', () => {});
});