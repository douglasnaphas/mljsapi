function* roomCodeGenerator(options) {
  const crypto = require('crypto');
  const alphabet = ['Q','J','B','P','T','F','A','E','M','C','S','I','K','O','D',
    'G','H','U','W','Y','Z','X','L','N','R','V'];
  const { digits } = options;
  let code = '';
  for(let i = 0; i < digits; i++) {
    code = code + alphabet[i];
  }
  yield code;
}

module.exports = roomCodeGenerator;