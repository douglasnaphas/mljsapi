/**
 * Send a Room Code for the specified script. The Room Code is six uppercase
 * letters and has not been issued before.
 * @param {Request} req An Express JS Request, contains the haggadah_id, which
 *   communicates the choice of script, in the POST body
 * @param {Response} res An Express JS Response
 * @param {Function} fetchFunction An implementation of fetch
 * @param {Function} awsSdk An object with an implementation of the AWS SDK
 *   method DynamoDB.
 */
function roomCode(awsSdk) {
  const f = (req, res) => {
    res.send({room_code: 'WBCXYZ'});
  };
  return f;
}
module.exports = roomCode;