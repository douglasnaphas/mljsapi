/**
 * Return an Express-friendly function that returns a Room Code for a specified
 * script. The Room Code is six uppercase letters and has not been issued
 * before.
 * @param {Function} awsSdk An object with an implementation of the AWS SDK
 *   method DynamoDB.
 * @param {Function*} roomCodeGenerator A Generator that yields a series of
 *   room codes.
 * @return {Function(Request, Response)} A function that can be used with an
 *   Express JS route like app.post('/endpoint', roomCode(awsSdk)).
 */
function roomCode(awsSdk, roomCodeGenerator) {
  const f = (req, res) => {
    roomCodeGenerator = roomCodeGenerator || function* (){};
    
    
    
    const dynamodb = new awsSdk.DynamoDB();
    const params = {
      TableName: 'seders',
      Item: {
          'room_code': {
            S: 'AEFTTG'
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
    dynamodb.putItem(params, (err, data) => {
      if (err) {
        console.log('***** error occurred describing table');
        console.log(err, err.stack);
        res.send({ err: 'Mad Liberation server error' });
      } // an error occurred
      else {
        console.log('###### successfully described table');
        console.log(data);
        res.send({ Output: data });
      }
    });
  }
  return f;
}
module.exports = roomCode;