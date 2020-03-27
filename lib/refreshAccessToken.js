
const refreshAccessToken = async (refreshToken) => {
  const axios = require("axios");
  // console.log(axios);
  return await axios.get("https://jsonplaceholder.typicode.com/posts/1").
    then(r => r.data);
};
module.exports = refreshAccessToken;