const axios = require("axios");

function getCognitoClientSecret(awsSdk) {
  const middleware = async (req, res, next) => {
    const responses = require("../responses");
    const params = {
      ClientId: "25h54vd0cundt7iaeon1rn8a02",
      UserPoolId: "us-east-1_Yn89yKizn"
    };
    const cognitoidentityserviceprovider = new awsSdk.CognitoIdentityServiceProvider();

    const response = await new Promise((resolve, reject) => {
      cognitoidentityserviceprovider.describeUserPoolClient(
        params,
        (err, data) => {
          resolve({ err: err, data: data });
        }
      );
    });
    const { data, err } = response;
    if (data && data.UserPoolClient && data.UserPoolClient.ClientSecret) {
      res.locals.clientSecret = data.UserPoolClient.clientSecret;
      return next();
    }
    if (err) {
      console.log("getCognitoClientSecret: error getting client secret");
      console.log(err);
      return res.status(500).send(res.SERVER_ERROR);
    }
    console.log("getCognitoClientSecret: no data, no error");
    return res.status(500).send(res.SERVER_ERROR);
  };
  return middleware;
}
module.exports = getCognitoClientSecret;
