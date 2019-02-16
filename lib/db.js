async function db(req, res) {
  // requirements for this query:
  //   - take room code and game name
  //   - if there is no unexpired seder with this room code, fail
  //   - if a person with this game name is alrady at the seder, fail
  //   - record (room code, game name) -> session key on success
  //   - on failure, indicate whether it failed due to code or name
  
  const awsSdk = require('aws-sdk');
  const Configs = require('../Configs');
  
  const dynamodb = new awsSdk.DynamoDB.DocumentClient();
  const roomCode = req.body.roomCode;
  const gameName = req.body.gameName;
  const now = new Date();
  const minCreated = now.getTime() - Configs.msToJoinSeder();
  let dbResponse;
  
  const params = {
    TransactItems: [
      { // condition check: seder must exist
        ConditionCheck: {
          ConditionExpression: 'attribute_exists(room_code) AND #C > :mc',
          Key: {
            'room_code': roomCode,
            'lib_id': '000'
          },
          TableName: 'seders',
          ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
          ExpressionAttributeNames: {
            '#C': 'created'
          },
          ExpressionAttributeValues: {
            ':mc': minCreated
          }
        }
      },
      {
        Put: {
          Item: {
            'room_code': roomCode,
            'lib_id': 'participant',
            'session_key': 'SAMPLESESSIONKEY'
          },
          ConditionExpression: 'attribute_not_exists(room_code) AND ' +
            'attribute_not_exists(lib_id)',
          TableName: 'seders',
          ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
        }
      },
      // {
      //   Update: {
      //     Key: {
      //       'room_code': roomCode,
      //       'lib_id': 'participant#',
      //     },
          
      //   }
      // }
    ]
  };
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
  
  // another query:
  // get all the participants at a seder
}

module.exports = db;

// TODO: run it with just the condition check, see the response