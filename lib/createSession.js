/**
 * Save the session info for the request's Room Code, Game Name pair in the DB,
 * specifically the cookie value for this Game Name.
 * @param {Function} awsSdk An object with a DynamoDB.DocumentClient() function
 * that returns an object with implementations of the AWS SDK DocumentClient's
 * update function.
 */
function createSession(awsSdk) {
  
}

module.exports = createSession;