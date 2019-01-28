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
    roomCodeGenerator = roomCodeGenerator || require('./roomCodeGenerator');
    const roomCodeSequence = roomCodeGenerator({ letters: 6 });
    
    const dynamodb = new awsSdk.DynamoDB();
    let code;
    let params;
    let dbResponse;
    code = roomCodeSequence.next().value;
    params = {
      TableName: 'seders',
      Item: {
          'room_code': {
            S: code
          },
          'lib_id': {
            S: 'xyz'
          },
          'timestamp': {
            S: new Date().toISOString()
          }
      },
      ConditionExpression: 'attribute_not_exists(room_code)'
    };
    
    dbResponse = await new Promise((resolve, reject) => {
      dynamodb.putItem(params, (err, data) => {
        if (err) {
          console.log('***** error creating room code ' + code);
          console.log(err, err.stack);
          resolve({ err: 'Mad Liberation server error' });
        } // an error occurred
        else {
          console.log('###### created room code ' + code);
          console.log(code);
          resolve({ roomCode: code });
        }
      });
    });
    if(dbResponse.err) {
      res.send({ err: 'Mad Liberation server error' });
    } else if(dbResponse.roomCode) {
      res.send({ roomCode: dbResponse.roomCode });
    }
  }
  return f;
  
  // TODO: set up the single-attempt case (no collision handling) w/ await DONE
  // TODO: test the single-attempt case using a duplicate generator DONE
  // TODO: set up loop case
}
module.exports = roomCode;