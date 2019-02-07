function joinSeder(awsSdk) {
  const f = async (req, res) => {
    const dynamodb = new awsSdk.DynamoDB();
    const params = {
      ExpressionAttributeNames: {
        '#P': 'participants'
      },
      ExpressionAttributeValues: {
        ':p': {L:
          [
            {S: 'new participant 1'}
          ]}
      },
      Key: {
        'room_code': {
          S: 'BYQIHF'
        },
        'lib_id': {
          S: '000'
        }
      },
      ReturnValues: 'ALL_NEW',
      TableName: 'seders',
      UpdateExpression: 'ADD #P :p'
    };
    const dbResponse = await new Promise((resolve, reject) => {
      dynamodb.updateItem(params, (err, data) => {
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