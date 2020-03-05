class Configs {
  static allowedOrigin(origin) {
    if (/^https:\/\/([^\/]+[.])?madliberationgame.com$/.test(origin)) {
      return origin;
    }
    if (/^https:\/\/([^\/]+[.])?passover.lol$/.test(origin)) {
      return origin;
    }
    return "https://madliberationgame.com";
  }

  static jwksUrl() {
    return (
      "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Yn89yKizn/." +
      "well-known/jwks.json"
    );
  }

  static CognitoClientID() {
    return "25h54vd0cundt7iaeon1rn8a02";
  }

  static CognitoUserPoolID() {
    return "us-east-1_Yn89yKizn";
  }

  static CognitoTokenEndpointURL() {
    return (
      "https://madliberationfederated.auth.us-east-1.amazoncognito.com/" +
      "oauth2/token"
    );
  }

  static CognitoRedirectURI(protocol, host) {
    if (!protocol || !host) {
      return "https://api.passover.lol/get-cookies";
      
    }
    if (/https?/.test(protocol) && /^api-dev.passover.lol$/.test(host)) {
      return "https" + "://" + host + "/get-cookies";
    }
    if (/https?/.test(protocol) && /^localhost(:[0-9]{1,5})?$/.test(host)) {
      return protocol + "://" + host + "/get-cookies";
    }
    return "https://api.passover.lol/get-cookies";
  }

  /**
   * @return {Number} The number of milliseconds allowed to elapse before a new
   * seder cannot be joined.
   */
  static msToJoinSeder() {
    return 1000 /* ms/s */ * 60 /* s/minute */ * 480 /* minutes */;
  }

  /**
   * @return {Number} The number of milliseconds allowed to elapse before a
   * seder cannot be played (no lib submissions allowed).
   */
  static msToFinishSeder() {
    return 1000 /* ms/s */ * 60 /* s/m */ * 60 /* m/h */ * 24 /* hours */;
  }

  /**
   * @return {Number} The number of letters that should be in the value of the
   * cookie sent to keep track of who has a Game Name for a Seder
   */
  static cookieValueLength() {
    return 30;
  }

  /**
   * @return {String} A prefix for the name of the cookie sent for the Game
   * Name, to ensure the cookie name does not conflict with anything
   */
  static gameNameCookiePrefix() {
    return "gamename";
  }

  static illegalGameNameCharacters() {
    return [";", "=", "(", ")"];
  }

  static roomCodePattern() {
    return /[A-Z]{6}/;
  }

  static roomCodeBlacklist() {
    return /[^A-Z]/g;
  }

  static gameNameBlacklist() {
    return /[^-A-Za-z ,0-9]/g;
  }

  static libBlacklist() {
    return /[^-A-Za-z ,0-9."'?!/]/g;
  }
  
  static roomCodeRetries() {
    return 50;
  }
}

module.exports = Configs;
