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
  /**
   * @param String roomCode
   * @param String gameName
   * @param String message
   * @param String status The status about to be returned by the API
   * @return Object An object that will work as params to Dynamo's TransactWrite
   * to write the event to the log table.
   */
  static dbParams({roomCode, gameName, message, status}) {
    
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