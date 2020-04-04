const responses = require("../responses");
const logger = require("../logger");
const seders = [
  // if no res.locals.userEmail, 400
  (req, res, next) => {
    if(!res.locals.userEmail) {
      logger.log(`seders: request received with no userEmail`);
    }
    res.sendStatus(400);
  },
  
  // dbParams to query the seders index
  
  
  // query
  
  // response
];
module.exports = seders;