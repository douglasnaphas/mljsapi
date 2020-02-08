const saveIdTokenFromCookie = require("./saveIdTokenFromCookie");
const jwk2Pem = require("jwk-to-pem");
const jwt = require("jsonwebtoken");
const checkJwt = require("./checkJwt");
const axios = require("axios");
const getUserInfo = require("./getUserInfo");
const getMadLnJwksFromAws = require("./getMadLnJwksFromAws");

/**
 * Read the user's identity from the id_token JWT in the id_token cookie.
 * Respond with the user's nickname and email in the response body. Respond 400
 * if there is no valid id_token cookie with the needed info.
 */
const id = [
  saveIdTokenFromCookie(),
  getMadLnJwksFromAws(axios),
  checkJwt({ jwk2Pem, jwt, tokenType: "id" }),
  getUserInfo(jwt),
  (req, res, next) => {
    res.send({ nickname: res.locals.nickname, email: res.locals.email });
  }
];
module.exports = id;