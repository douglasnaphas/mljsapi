class Configs {
  static allowedOrigin() {
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
