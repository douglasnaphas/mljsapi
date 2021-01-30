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
    return process && process.env && process.env["JWKS_URL"];
  }

  static CognitoClientID() {
    return process && process.env && process.env["COGNITO_CLIENT_ID"];
  }

  static CognitoUserPoolID() {
    return process && process.env && process.env["COGNITO_USER_POOL_ID"];
  }

  static CognitoTokenEndpointURL() {
    return process && process.env && process.env["COGNITO_TOKEN_ENDPOINT_URL"];
  }

  static CognitoRedirectURI(protocol, host) {
    if (!protocol || !host) {
      return (
        process && process.env && process.env["COGNITO_DEFAULT_REDIRECT_URI"]
      );
    }
    if (/https?/.test(protocol) && /^api-dev.passover.lol$/.test(host)) {
      return "https" + "://" + host + "/get-cookies";
    }
    if (/https?/.test(protocol) && /^localhost(:[0-9]{1,5})?$/.test(host)) {
      return protocol + "://" + host + "/get-cookies";
    }
    return (
      process && process.env && process.env["COGNITO_DEFAULT_REDIRECT_URI"]
    );
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
    return 10;
  }
}

module.exports = Configs;
