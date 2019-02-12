/**
 * Save the session info for the request's Room Code, Game Name pair in the DB,
 * specifically the cookie value for this Game Name.
 * @param {Function} awsSdk An object with a DynamoDB.DocumentClient() function
 * that returns an object with implementations of the AWS SDK DocumentClient's
 * update function.
 */
function createSession(awsSdk) {
  const middleware = async (req, res, next) => {
    const dynamodb = new awsSdk.DynamoDB.DocumentClient();
    const roomCode = req.body.roomCode;
    const gameName = req.body.gameName;
    const sessionKey = req.cookies[gameName];
    const params = {
      ExpressionAttributeNames: {
        '#P': 'participant',
        '#S': 'session_key'
      },
      ExpressionAttributeValues: {
        ':p': gameName,
        ':s': sessionKey
      },
      Key: {
        'room_code': roomCode,
        'lib_id': 'participant'
      },
      TableName: 'seders',
      UpdateExpression: 'SET #P = :p, #S = :s',
    };
    const dbResponse = await new Promise((resolve, reject) => {
      dynamodb.update(params, (err, data) => {
        if (err) {
          resolve({madliberation_error: err});
        } else {
          resolve(data);
        }
      });
    });
    
    next();
  };
  return middleware;
}

module.exports = createSession;