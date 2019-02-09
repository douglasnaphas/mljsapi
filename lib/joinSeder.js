/**
 * @param {Function} awsSdk An object with a DynamoDB.DocumentClient() function
 * that returns an object with implementations of the AWS SDK DocumentClient's
 * createSet and update functions.
 * @return {Function} an Express handler that responds 200 when the request post
 * body has roomCode set to an existing Room Code, and gameName set to an
 * available name for that code; responds 400 otherwise.
 */
function joinSeder(awsSdk) {
  const f = async (req, res) => {
    if(! req ||
       ! req.body ||
       ! req.body.roomCode ||
       ! req.body.gameName) {
      res.status(400).send();
      return;
    }
    const dynamodb = new awsSdk.DynamoDB.DocumentClient();
    const roomCode = req.body.roomCode;
    const gameName = req.body.gameName;
    const params = {
      ExpressionAttributeNames: {
        '#P': 'participants'
      },
      ExpressionAttributeValues: {
        ':p': 
          dynamodb.createSet([gameName])
      },
      Key: {
        'room_code': roomCode,
        'lib_id': '000'
      },
      ReturnValues: 'UPDATED_OLD', // use UPDATED_OLD, and look for the name
                                   // we added. If it's there, fail: the name
                                   // was taken. If it's not, we need to update
                                   // the table with this name's session key
      TableName: 'seders',
      UpdateExpression: 'ADD #P :p',
      ConditionExpression: 'attribute_exists(room_code)'
    };
    const dbResponse = await new Promise((resolve, reject) => {
      dynamodb.update(params, (err, data) => {
        if (err) {
          console.log(err);
          resolve({madliberation_error: err});
        } else {
          resolve(data);
        }
      });
    });
    if(dbResponse.madliberation_error) {
      return res.status(400).send();
    }
    return res.send(dbResponse);
  };
  return f;
}
module.exports = joinSeder;