async function db(req, res) {
  const awsSdk = require('aws-sdk');
  const Configs = require('../Configs');
  const schema = require('../schema');
  const dynamodb = new awsSdk.DynamoDB.DocumentClient();
  const roomCode = req.body.roomCode;
  const partLibId = req.body.partLibId;
  let dbResponse;
  const assignments = [
    {id: 1, prompt: 'please lib 3'},
    {id: 2, prompt: 'no example, sentence, or default in this lib'},
    {id: 3, prompt: 'this has all props', sentence: 'You are a _',
      defaultAnswer: 'NONE OF THESE STRINGS CAN BE BLANK'},
    {id: 4, prompt: 'It will be', sentence: 'tiring as _',
      defaultAnswer: 'to enter all these participants'},
    {id: 5, prompt: 'and libs', sentence: 'but oh _',
      defaultAnswer: 'it must be done'}
  ];
  const params = {
    TransactItems: [
      {
        Update: {
          TableName: schema.TABLE_NAME,
          Key: {},
          UpdateExpression: 'SET #A = :a',
          ExpressionAttributeNames: {'#A': schema.ASSIGNMENTS},
          ExpressionAttributeValues: {':a': assignments},
          ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
          ConditionExpression: `attribute_exists(${schema.PARTITION_KEY})`
        }
      }
    ]
  };
  params.TransactItems[0].Update.Key[`${schema.PARTITION_KEY}`] = roomCode;
  params.TransactItems[0].Update.Key[`${schema.SORT_KEY}`] =
    req.body.partLibId;
  dbResponse = await new Promise((resolve, reject) => {
    dynamodb.transactWrite(params, (err, data) => {
      if (err) {
        resolve({madliberation_error: err});
      } else {
        resolve(data);
      }
    });
  });
  res.send(dbResponse);

}

module.exports = db;