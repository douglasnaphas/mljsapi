const axios = require("axios");
const awsSdk = require("aws-sdk");

function getCognitoTokens() {
  const middleware = async (req, res, next) => {
    const responses = require("../responses");
    // if(!res.locals[paramsName]) {
    //   return res.status(500).send(responses.SERVER_ERROR);
    // }
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
    res.locals.describeError = response.err;
    res.locals.describeData = response.data;
    console.log("err:");
    console.log(response.err);
    console.log("data");
    console.log(response.data);
    return next();
  };
  return middleware;
}
module.exports = getCognitoTokens;
