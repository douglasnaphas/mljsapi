const api = require('../../api');
const checkBody = require('../checkBody');
const lintAnswers = require('./lintAnswers');

/**
 * pre:
 *   1) req.body.roomCode and req.body.gameName are strings
 *   2) req.body.answers is an array of {id: <NUMBER>, answer: <STRING>}
 * post:
 *   1) In the DB, this participant's answers column is set to req.body.answers
 */
const submitLibsMiddleware = [
  // check that all post params are present
  checkBody([api.POST_BODY_PARAMS.ROOM_CODE, api.POST_BODY_PARAMS.GAME_NAME,
    api.POST_BODY_PARAMS.ANSWERS]),
  // check that answers is an array of objects with id properties
  lintAnswers()
  // set db params to record answers for this participant
  
  // execute query (transactWrite)
  
  // handle query errors
  
  // done
];
module.exports = submitLibsMiddleware;