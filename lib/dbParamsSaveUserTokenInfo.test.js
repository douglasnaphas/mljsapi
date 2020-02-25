/* globals expect, jest */
const dbParamsSaveUserTokenInfo = require('./dbParamsSaveUserTokenInfo');
const configs = require('../Configs');
const schema = require('../schema');
const responses = require('../responses');
const DbSchema = require('../DbSchema');
describe('dbParamsSaveUserTokenInfo', () => {
  test('...', () => {
    
  });
})
describe('dbParams example', () => {
  const runTest = ({locals, expectedDbParams, expectNext,
    expect500, expectedStatus, expectedData}) => {
    const middleware = dbParamsSaveUserTokenInfo();
    const req = {};
    const next = jest.fn();
    const res = {locals};
    const send = jest.fn();
    res.status = jest.fn(() => {return {send}});
    middleware(req, res, next);
    if(expectedDbParams) {
      expect(res.locals.submitLibsDbParams).toEqual(expectedDbParams);
    }
    if(expectNext) {
      expect(next).toHaveBeenCalled();
    }
    if(expect500) {
      expect(res.status).toHaveBeenCalledWith(500);
      expect(send).toHaveBeenCalledWith(responses.SERVER_ERROR);
    }
    if(expectedStatus) {
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    }
    if(expectedData) {
      expect(send).toHaveBeenCalledWith(expectedData);
    }
  };
  test.skip('happy path 1', () => {
    const body = {
      roomCode: 'AABBCC',
      gameName: 'me',
      answers: [
        {id: 4, answer: 'the fourth'},
        {id: 8, answer: 'the orth'},
        {id: 9, answer: 'the north'}
      ]
    };
    const expectedDbParams = {
      TransactItems: [
        {
          Update: {
            TableName: schema.TABLE_NAME,
            Key: {},
            UpdateExpression: 'SET #A = :a',
            ExpressionAttributeNames: {'#A': schema.ANSWERS},
            ExpressionAttributeValues: {':a': body.answers},
            ConditionExpression: 'attribute_exists(' + schema.ASSIGNMENTS + ')',
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
          }
        }
      ]
    };
    expectedDbParams.TransactItems[0].Update.Key[`${schema.PARTITION_KEY}`] =
      body.roomCode;
    expectedDbParams.TransactItems[0].Update.Key[`${schema.SORT_KEY}`] =
      DbSchema.sortKeyFromGameName(body.gameName);
    runTest({
      body: body,
      expectedDbParams: expectedDbParams,
      expectNext: true
    });
  });
  test.skip('happy path 2', () => {
    const body = {
      roomCode: 'CARCAR',
      gameName: 'someone else',
      answers: [
        {id: 14, answer: 'the filth'},
        {id: 81, answer: 'the wealth'},
        {id: 19, answer: 'the hearth'}
      ]
    };
    const expectedDbParams = {
      TransactItems: [
        {
          Update: {
            TableName: schema.TABLE_NAME,
            Key: {},
            UpdateExpression: 'SET #A = :a',
            ExpressionAttributeNames: {'#A': schema.ANSWERS},
            ExpressionAttributeValues: {':a': body.answers},
            ConditionExpression: 'attribute_exists(' + schema.ASSIGNMENTS + ')',
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
          }
        }
      ]
    };
    expectedDbParams.TransactItems[0].Update.Key[`${schema.PARTITION_KEY}`] =
      body.roomCode;
    expectedDbParams.TransactItems[0].Update.Key[`${schema.SORT_KEY}`] =
      DbSchema.sortKeyFromGameName(body.gameName);
    runTest({
      body: body,
      expectedDbParams: expectedDbParams,
      expectNext: true
    });
  });
  test.each`
  nickname      | email               | sub                 | cUn
  ${"nick nom"} | ${"subulu@row.com"} | ${"423j-erjke-FE2"} | ${undefined}
  `('missing locals property, nickname $nickname, email $email, sub $sub, ' +
    'cognito:username $cUn, expect 500', ({
      nickname, email, sub, cUn
    }) => {
      
    }
  );
  test.skip('missing roomCode in req.body', () => {
    const body = {
      noRoomCode: 'note there is no room code',
      gameName: 'my',
      answers: [
        {id: 6, answer: 'the missing'},
        {id: 44},
        {id: 3, answer: 'hissith'}
      ]
    };
    runTest({
      body: body,
      expectedStatus: 400,
      expectedData: responses.BAD_REQUEST
    });
  });
  test.skip('missing answers in req.body', () => {
    const body = {
      roomCode: 'SOMECO',
      gameName: 'some name is present',
      noAnswers: 'answers not in this body'
    }
    runTest({
      body: body,
      expectedStatus: 400,
      expectedData: responses.BAD_REQUEST
    });
  });
  test.skip('missing gameName', () => {
    const body = {
      roomCode: 'SOMECO',
      answers: ['we have answers', 'but no gameName']
    }
    runTest({
      body: body,
      expectedStatus: 400,
      expectedData: responses.BAD_REQUEST
    });
  });
});