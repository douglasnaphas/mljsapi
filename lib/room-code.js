/**
 * Return an Express-friendly function that returns a Room Code for a specified
 * script. The Room Code is six uppercase letters and has not been issued
 * before.
 * @param {Function} awsSdk An object with an implementation of the AWS SDK
 *   method DynamoDB.
 * @param {Function*} roomCodeGenerator A Generator that yields a series of
 *   room codes, default roomCodeGenerator.js.
 * @return {Function(Request, Response)} A function that can be used with an
 *   Express JS route like app.post('/endpoint', roomCode(awsSdk)).
 */
function roomCode(awsSdk, roomCodeGenerator) {
  const f = async (req, res) => {
    if(! req ||
       ! req.body ||
       ! req.body.path) {
      res.status(400).send();
    }
    roomCodeGenerator = roomCodeGenerator || require('./roomCodeGenerator');
    const roomCodeSequence = roomCodeGenerator({ letters: 6 });
    
    const dynamodb = new awsSdk.DynamoDB();
    let code;
    let params;
    let dbResponse;
    let success;
    success = false;
    const attempts = 50000;
    
    for(let i = 0; ! success && i < attempts; i++) {
      code = roomCodeSequence.next().value;
      params = {
        TableName: 'seders',
        Item: {
          'room_code': {
            S: code
          },
          'lib_id': {
            S: '000'
          },
          'timestamp': {
            S: new Date().toISOString()
          },
          'comment': {
            S: 'placeholder for this seder, not a real lib'
          },
          'path': {
            S: req.body.path
          }
        },
        ConditionExpression: 'attribute_not_exists(room_code)'
      };
      dbResponse = await new Promise((resolve, reject) => {
        dynamodb.putItem(params, (err, data) => {
          if (err) {
            resolve({ err: 'Mad Liberation server error' });
          }
          else {
            resolve({ roomCode: code });
          }
        });
      });
      if(dbResponse.err) {
        // res.send({ err: 'Mad Liberation server error' });
      } else if(dbResponse.roomCode) {
        success = true;
        res.send({ roomCode: dbResponse.roomCode });
      }
    }
  }
  return f;
}
module.exports = roomCode;