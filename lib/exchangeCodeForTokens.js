const Configs = require("../Configs");
const qs = require("querystring");

function exchangeCodeForTokens(axios) {
  const middleware = async (req, res, next) => {
    axios
      .post(
        Configs.CognitoTokenEndpointURL(),
        qs.stringify({
          grant_type: "authorization_code",
          client_id: Configs.CognitoClientID(),
          code: req.query.code,
          redirect_uri: Configs.CognitoRedirectURI()
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              Buffer.from(
                Configs.CognitoClientID() + ":" + res.locals.clientSecret
              ).toString("base64")
          }
        }
      )
      .then(response => {
        res.locals.tokensResponse = response;
        return next();
      })
      .catch(err => {
        console.log("exchangeCodeForTokens: error getting tokens");
        console.log(err);
        return res.sendStatus(500);
      });
  };
  return middleware;
}
module.exports = exchangeCodeForTokens;
