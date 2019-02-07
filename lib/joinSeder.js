function joinSeder(awsSdk) {
  const f = async (req, res) => {
    const dynamodb = new awsSdk.DynamoDB.DocumentClient();
    const params = {
      ExpressionAttributeNames: {
        '#P': 'participants'
      },
      ExpressionAttributeValues: {
        ':p': 
          dynamodb.createSet(['new person 5'])
      },
      Key: {
        'room_code': 'AIWIKA',
        'lib_id': '000'
      },
      ReturnValues: 'UPDATED_OLD', // use UPDATED_OLD, and look for the name
                                   // we added. If it's there, fail: the name
                                   // was taken. If it's not, we need to update
                                   // the table with this name's session key
      TableName: 'seders',
      UpdateExpression: 'ADD #P :p'
    };
    const dbResponse = await new Promise((resolve, reject) => {
      dynamodb.update(params, (err, data) => {
        if (err) {
          console.log(err);
          resolve({madliberation_error: err});
        } else {
          resolve({result: data});
        }
      });
    });
    res.send(dbResponse);
  };
  return f;
}
module.exports = joinSeder;