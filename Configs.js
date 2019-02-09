class Configs {
  static allowedOrigin(origin) {
    if(/https:\/\/([^\/]+[.])?madliberationgame.com/.test(origin)) {
      return origin;
    }
    return 'https://madliberationgame.com';
  }

  static jwksUrl() {
    return (
      'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Yn89yKizn/.' +
      'well-known/jwks.json'
    );
  }
  
  /**
   * @return {Number} The number of milliseconds allowed to elapse before a new
   * seder cannot be joined.
   */
  static msToJoinSeder() {
    return 1000 /* ms/s */ * 60 /* s/minute */ * 30 /* minutes */;
  }
  
  /**
   * @return {Number} The number of milliseconds allowed to elapse before a
   * seder cannot be played (no lib submissions allowed).
   */
  static msToFinishSeder() {
    return 1000 /* ms/s */ * 60 /* s/m */ * 60 /* m/h */ * 24 /* hours */;
  }
}

module.exports = Configs;
