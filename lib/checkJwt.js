/**
 * @param {*} jwk2Pem Library like jwk-to-pem
 * @param {*} jwt Library like jsonwebtoken
 * @param {string} tokenType "id" | "access" | "refresh"
 * @param {*} local Object, name of a res.locals property whose absence means
 *   this is a non-authenticated request, and the returned middleware should
 *   call next() and do nothing else
 * @return middleware satisfying:
 *   - if 
 */
const checkJwt = ({ jwk2Pem, jwt, tokenType, local }) => {
  const middleware = (req, res, next) => {
    if(local && !res.locals[local]) return next();
    let jot;
    if (tokenType === "id") {
      jot = res.locals.id_token;
    } else if (tokenType === "access") {
      jot = res.locals.access_token;
    } else if (tokenType === "refresh") {
      jot = res.locals.refresh_token;
    }
    if (!jot) {
      console.log("checkJwt: invalid tokenType or jot not set");
      console.log(tokenType);
      console.log(jot);
      return res.sendStatus(500);
    }
    const decodedJot = jwt.decode(jot, { complete: true });
    if (
      !decodedJot ||
      !decodedJot.header ||
      !decodedJot.payload ||
      !decodedJot.signature
    ) {
      console.log("checkJwt: error decoding JWT");
      console.log("decodedJot:");
      console.log(decodedJot && decodedJot.header);
      console.log(decodedJot && decodedJot.payload);
      return res.sendStatus(500);
    }
    if (!decodedJot.header.kid) {
      console.log("checkJwt: no decodedJot.header.kid");
      console.log(decodedJot.header);
      return res.sendStatus(500);
    }
    const { jwks } = res.locals;
    let jwkFound = false;
    let jwk;
    let jwkPem;
    for (let i = 0; i < jwks.length; i++) {
      if (decodedJot.header.kid == jwks[i].kid) {
        jwkFound = true;
        jwk = jwks[i];
        jwkPem = jwk2Pem(jwk);
        if (!jwkPem) {
          console.log("checkJwt: unable to convert JWK to PEM");
          console.log(jwk);
          return res.sendStatus(500);
        }
        break;
      }
    }
    if (!jwkFound) {
      console.log("checkJwt: could not find JWK");
      console.log(jwks);
      console.log(decodedJot.header);
      return res.sendStatus(500);
    }
    try {
      jwt.verify(jot, jwkPem, { algorithm: "RS256" });
      console.log("JWT valid");
      return next();
    } catch (err) {
      console.log("checkJwt: JWT verification failed");
      console.log(err);
      return res.sendStatus(500);
    }
  };
  return middleware;
};
module.exports = checkJwt;
