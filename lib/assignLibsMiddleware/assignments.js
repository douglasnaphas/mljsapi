/**
 * pre:
 *   1) res.locals.libs is an array of libs
 *   2) res.locals.participants is an array of {participant: '<hash>'} objects,
 *      where <hash> is the hash that appears in the lib_id DB column
 * post:
 *   1) res.locals.participants' entries each have libs: [{<lib>}], where each
 *      <lib> is a lib from res.locals.libs, assigned to the participant
 *   2) no participant has more than one more lib than any other participant
 */
function assignments() {
  
}
module.exports = assignments;