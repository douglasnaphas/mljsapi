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
  // indexes
  SCRIPTS_INDEX: 'scripts',
  SCRIPTS_PART_KEY: 'is_script',
  // attribute names
  // scripts
  HAGGADAH_DESCRIPTION: 'haggadah_description',
  HAGGADAH_NAME: 'haggadah_name',
  HAGGADAH_SHORT_DESC: 'haggadah_short_desc',
  PATH: 'path',
  SCRIPT_NUMBER: 'script_number',
  // seders
  CREATED: 'created',
  // participants
  SESSION_KEY: 'session_key'
  
}

module.exports = schema;