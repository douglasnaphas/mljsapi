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
  static eventSortIdIndex() {
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
   * @param String event, optional, the event type, like "success"
   * @param Function randomNumber A function that will be called like
   * randomNumber(1, 1000000000) to generate a number from 1 to 1000000000
   * (1 to 1 billion), inclusive, required
   * @return Object An object that will work as params to Dynamo's TransactWrite
   * to write the event to the log table.
   */
  static dbParams({roomCode, gameName, message, status, now, randomNumber,
    event}) {
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
    const n = randomNumber(1, 1000000000);
    const timestampHashN = now.toISOString() + '#' + n;
    params.TransactItems[0].Put.Item[this.sortKey()] = timestampHashN;
    if(event) {
      params.TransactItems[0].Put.Item[this.eventSortIdIndex().partitionKey]
        = event;
      params.TransactItems[0].Put.Item[this.eventSortIdIndex().sortKey]
        = timestampHashN;
    }
    return params;
  }
  /**
   * Run (new awsSdk.DynamoDB.DocumentClient()).transactWrite with params
   */
  static async runQuery(awsSdk, params) {
    const dynamodb = new awsSdk.DynamoDB.DocumentClient();
    const dbResult = await new Promise((resolve, reject) => {
      dynamodb.transactWrite(params, (err, data) => {
        resolve({err: err, data: data});
      });
    });
   return dbResult; 
  }
  /**
   * Run runQuery with the result from dbParams
   */
  static async log({roomCode, gameName, message, status, event}) {
    const now = new Date();
    const randomNumber = require('./randomNumber');
    const awsSdk = require('aws-sdk');
    // make db params
    const params = this.dbParams({roomCode:roomCode, gameName: gameName,
      message: message, status: status, now: now, randomNumber: randomNumber,
      event: event});
    // run query
    await this.runQuery(awsSdk, params);
  }
}
module.exports = Logger;