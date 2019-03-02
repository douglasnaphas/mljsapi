const schema = require('./schema');
const getHash = require('./lib/getHash');
class Schema {
  static sortKeyFromGameName(gameName) {
    return schema.PARTICIPANT_PREFIX + schema.SEPARATOR + getHash(gameName);
  }
}
module.exports = Schema;