/*global expect*/

const roomCode = require('./room-code');

describe('room-code', () => {
  test('a successfully saved code should be returned', async () => {
    const expectedCode = 'ABCDXY'
    
    // make a generator that will make a code
    const roomCodeGenerator = function* () {
      yield expectedCode;
    };
    
    // make a DB obj that always succeeds
    const dynamodb = {
      putItem: (params, cb) => {cb(false, true);}
    };
    const awsSdk = {
      DynamoDB: class {
        constructor() {
          return dynamodb;
        }
      }
    };
    
    // call the returned function with a res object that passes the test in its
    // send method (by setting a flag) if called with anything other than the
    // code
    const f = roomCode(awsSdk, roomCodeGenerator);
    let failTest = true;
    const res = {
      send: data => {
        if(data && data.roomCode && data.roomCode == expectedCode) {
          failTest = false;
        }
      }
    };
    await f({}, res);
    expect(failTest).toBeFalsy();
    
  });
  
  test('series of bad codes followed by good code', () => {
    // make a generator that will make 5 distinct codes, first 4 the same
    
    // make a DB obj that fails on the first 5 codes, succeeds on the last
    
    // call the returned function with a res object that passes the test in its
    // send method (by setting a flag) if called with anything other than the
    // last code
  });
  
  test('architecture when putItem fails', () => {
    const f = async (req, res) => {
      const dynamodb = {
        putItem: (params, cb) => {cb(true, false);}
      };
      let code;
      code = await new Promise((resolve, reject) => {
        dynamodb.putItem({}, (err, data) => {
          if(err) {
            resolve(0);
          } else if(data) {
            resolve('ABCDEF');
          }
        });
      });
    };
    f();
  });
  test('architecture when putItem succeeds', () => {
    const f = async (req, res) => {
      const dynamodb = {
        putItem: (params, cb) => {cb(false, true);}
      };
      let code;
      code = await new Promise((resolve, reject) => {
        dynamodb.putItem({}, (err, data) => {
          if(err) {
            resolve(0);
          } else if(data) {
            resolve('ABCDEF');
          }
        });
      });
    };
    f();
  });
});