const Configs = require("../Configs");
function exchangeCodeForTokens(axios) {
  const middleware = async (req, res, next) => {
    axios
      .post(
        Configs.CognitoTokenEndpointURL(),
        {
          grant_type: "authorization_code",
          client_id: Configs.CognitoClientID,
          code: req.query.code,
          redirect_uri: Configs.redirect_uri()
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              Buffer.from(
                Configs.CognitoClientID + ":" + res.locals.clientSecret
              ).toString("base64")
          }
        }
      )
      .then();
  };
  return middleware;
}
module.exports = exchangeCodeForTokens;
