function joinSeder(awsSdk) {
  const f = async (req, res) => {
    const dynamodb = new awsSdk.DynamoDB.DocumentClient();
    const params = {
      ExpressionAttributeNames: {
        '#P': 'participants'
      },
      ExpressionAttributeValues: {
        ':p': 
          dynamodb.createSet(['new person 2'])
      },
      Key: {
        'room_code': 'AIWIKA',
        'lib_id': '000'
      },
      ReturnValues: 'ALL_NEW',
      TableName: 'seders',
      UpdateExpression: 'ADD #P :p'
    };
    const dbResponse = await new Promise((resolve, reject) => {
      dynamodb.update(params, (err, data) => {
        if (err) {
          console.log(err);
          resolve({madliberation_error: err});
        } else {
          resolve({result: 'success'});
        }
      });
    });
    res.send(dbResponse);
  };
  return f;
}
module.exports = joinSeder;