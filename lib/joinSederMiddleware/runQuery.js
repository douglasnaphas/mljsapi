/**
 * Return middleware satisfying:
 * pre: res.locals.joinSederDbParams is set to an valid object for params to
 * aws-sdk.DynamoDB.DocumentClient.transactWrite
 * post: awsSdk.DynamoDB.DocumentClient.transactWrite is executed with the
 * supplied params, and res.locals.dbData and res.locals.dbError are populated
 * with the data and error from the execution
 * @param {Function} awsSdk An object providing aws-sdk's
 * DynamoDB.DocumentClient.transactWrite and DynamoDB.DocumentClient constructor
 * @return {Function} Express middleware that executes transactWrite
 */
async function runQuery(awsSdk) {
  
}
module.exports = runQuery;