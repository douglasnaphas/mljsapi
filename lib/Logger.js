class Logger {
  static tableName() {
    return 'madliberation-logs';
  }
  static partitionKey() {
    return 'room_code';
  }
  static sortKey() {
    return 'timestamp#number';
  }
  static evenSortIdIndex() {
    return {
      partitionKey: 'event',
      sortKey: 'sort_id'
    };
  }
  static gameName() {
    return 'game_name';
  }
  static message() {
    return 'message';
  }
  static status() {
    return 'status';
  }
  /**
   * @param String roomCode, required
   * @param String gameName optional, written to the log table if present
   * @param String message optional, written to the log table if present
   * @param String status The status about to be returned by the API, optional,
   * written to the log table if present
   * @param Date now, required
   * @param Function randomNumber A function that will be called like
   * randomNumber(1, 1000000000) to generate a number from 1 to 1000000000
   * (1 to 1 billion), inclusive, required
   * @return Object An object that will work as params to Dynamo's TransactWrite
   * to write the event to the log table.
   */
  static dbParams({roomCode, gameName, message, status, now, randomNumber}) {
    if(!roomCode || !now || !randomNumber) return null;
    const params = {
      TransactItems: [
        {
          Put: {
            Item: {},
            TableName: Logger.tableName()
          }
        }
      ]
    };
    params.TransactItems[0].Put.Item[this.partitionKey()] = roomCode;
    if(gameName) {
      params.TransactItems[0].Put.Item[this.gameName()] = gameName;
    }
    if(message) {
      params.TransactItems[0].Put.Item[this.message()] = message;
    }
    if(status) {
      params.TransactItems[0].Put.Item[this.status()] = status;
    }
    params.TransactItems[0].Put.Item[this.sortKey()] = now.toISOString() + '#'
      + randomNumber(1, 1000000000);
    return params;
  }
  /**
   * Run (new awsSdk.DynamoDB.DocumentClient()).transactWrite with params
   */
  static async runQuery({awsSdk, params}) {
    
  }
  /**
   * Run runQuery with the result from dbParams
   */
  static async log({res, awsSdk, roomCode, gameName, message, status}) {
    // make db params
    
    // run query
  }
}
module.exports = Logger;