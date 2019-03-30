/**
 * pre:
 *   1) res.locals.script is the script, parsed to an object
 * post:
 *   1) res.locals.script's libs contain ids in order
 *   2) res.locals.script's libs don't have example, sentence, or defaultAnswer
 *      properties
 */
function decorateLibs() {
  const responses = require('../../responses');
  const middleware = (req, res, next) => {
    if(!res.locals.script || !Array.isArray(res.locals.script.pages)) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    let id = 1;
    res.locals.script.pages.forEach(page => {
      if(!Array.isArray(page.lines)) return;
      page.lines.forEach(line => {
        if(!Array.isArray(line.segments)) return;
        line.segments.forEach(segment => {
          if(segment.type != 'lib') return;
          segment.id = id;
          segment.example = undefined;
          segment.sentence = undefined;
          segment['default'] = undefined;
          id++;
        });
      });
    });
    return next();
  };
  return middleware;
}
module.exports = decorateLibs;