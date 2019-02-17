/**
 * Contains various information about the database schema, such as attribute
 * names.
 * 
 * See https://github.com/douglasnaphas/madliberation/wiki/Database-schema.
 */
const schema = {
  TABLE_NAME: 'seders',
  // key attribute names
  PARTITION_KEY: 'room_code',
  SORT_KEY: 'lib_id',
  // relating to the compound sort key
  SEPARATOR: '#',
  SEDER_PREFIX: 'seder',
  PARTICIPANT_PREFIX: 'participant',
  SCRIPT_PREFIX: 'script',
  LIB_PREFIX: 'lib',
  // attribute names
  // scripts
  // seders
  CREATED: 'created'
  
}

module.exports = schema;