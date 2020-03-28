
const refreshAccessToken = async (refreshToken, clientSecret) => {
  const axios = require("axios");
  const Configs = require("../Configs");
  const getConfig = {
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ` + Buffer.from(
        `${Configs.CognitoClientID()}:${clientSecret}`
        ).toString('base64')
    },
    data: {
      grant_type: "refresh_token",
      client_id: Configs.CognitoClientID(),
      refresh_token: refreshToken
    }
  };
  return await axios.get(
    Configs.CognitoTokenEndpointURL(),
    getConfig)
    .then(r => r.data);
};
module.exports = refreshAccessToken;