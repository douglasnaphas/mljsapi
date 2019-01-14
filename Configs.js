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
}

module.exports = Configs;
