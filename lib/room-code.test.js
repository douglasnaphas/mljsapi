const roomCode = require('./room-code');

describe('room-code', () => {
  test('Room Code should be six letters', () => {});
  test('Room Codes from two calls should be different', () => {});
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
      console.log('the code is ' + code);
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
      console.log('the code is ' + code);
    };
    f();
  });
});