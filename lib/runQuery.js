/**
 * Return middleware satisfying:
 * pre: res.locals.rosterDbParams is set to an valid object for params to
 * aws-sdk.DynamoDB.DocumentClient.query
 * post: awsSdk.DynamoDB.DocumentClient.query is executed with the
 * supplied params, and res.locals.dbData and res.locals.dbError are populated
 * with the data and error from the execution
 * @param {Function} awsSdk An object providing aws-sdk's
 * DynamoDB.DocumentClient.query and DynamoDB.DocumentClient constructor
 * @param {String} paramsName The name of the res.locals property where the
 * params for this query are stored
 * @return {Function} Express middleware that executes query and calls next,
 * or sends 500 if res.locals.rosterDbParams is not defined
 */
function runQuery(awsSdk, paramsName) {
  const middleware = async (req, res, next) => {
    const responses = require('../responses');
    if(!res.locals[paramsName]) {
      console.log('****** rosterDbParams missing');
      console.log(res.locals);
      console.log(paramsName);
      return res.status(500).send(responses.SERVER_ERROR);
    }
    const dynamodb = new awsSdk.DynamoDB.DocumentClient();
    const dbResponse = await new Promise((resolve, reject) => {
      dynamodb.query(res.locals[paramsName], (err, data) => {
        resolve({err: err, data: data});
      });
    });
    res.locals.dbError = dbResponse.err;
    res.locals.dbData = dbResponse.data;
    console.log('****** dbError:');
    console.log(res.locals.dbError);
    console.log('****** dbData:');
    console.log(res.locals.dbData);
    return next();
  };
  return middleware;
}
module.exports = runQuery;