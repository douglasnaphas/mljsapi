/*global expect*/

const roomCode = require('./room-code');
const schema = require('../schema');

describe('room-code', () => {
  test('successfully saved code should be returned', async () => {
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
    const req = {body: {path: 'madliberation-scripts/001-Dirty_Script'}};
    const res = {
      send: data => {
        if(data && data.roomCode && data.roomCode == expectedCode) {
          failTest = false;
        }
      }
    };
    await f(req, res);
    expect(failTest).toBeFalsy();
  });
  test('series of bad codes followed by good code', async () => {
    // make a generator that will make 5 codes, first 4 the same
    const first4 = 'FFOURR';
    const fifth = 'FIFTHH';
    const codeSeries = [first4, first4, first4, first4, fifth];
    const roomCodeGenerator = function* () {
      for(let i = 0; i < 4; i++) {
        yield first4;
      }
      yield fifth;
    };
    
    // make a DB obj that fails on the first 4 codes, succeeds on the last
    const dynamodb = {
      putItem: (params, cb) => {
        if(params.Item.room_code.S == fifth) cb(false, true);
        else cb(true, false);
      }
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
    // last code
    const f = roomCode(awsSdk, roomCodeGenerator);
    let failTest = true;
    const req = {body: {path: 'madliberation-scripts/001-Dirty_Script'}};
    const res = {
      send: data => {
        if(data && data.roomCode && data.roomCode == fifth) {
          failTest = false;
        }
      }
    };
    await f(req, res);
    expect(failTest).toBeFalsy();
  });
  test('promise-based test expecting path to be saved', async () => {
    let correctlySaved = false;
    const result = await new Promise((resolve, reject) => {
      const code = 'COOODE';
      const path = 'madliberation-scripts/001-Dirty_Script';
      const roomCodeGenerator = function* () {
        yield code;
      };
      const dynamodb = {
        putItem: (params, cb) => {
          if(params &&
             params.Item &&
             params.Item.path &&
             params.Item.path.S &&
             params.Item.path.S == path &&
             params.Item.room_code &&
             params.Item.room_code.S && 
             params.Item.room_code.S == code &&
             params.Item.lib_id &&
             params.Item.lib_id.S &&
             params.Item.lib_id.S == schema.SEDER_PREFIX &&
             params.Item.created.N.match(/[0-9]{13}/)) {
            cb(false, true);
          }
        }
      };
      const awsSdk = {
        DynamoDB: class {
          constructor() {
            return dynamodb;
          }
        }
      };
      const req = {body: {path: path}};
      const res = {send: data => {resolve(data);}};
      const handler = roomCode(awsSdk, roomCodeGenerator);
      handler(req, res);
    });
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