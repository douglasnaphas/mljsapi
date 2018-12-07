const Identity = require('./Identity');
const jwt = require('jsonwebtoken');
// const jwkToPem = require('jwk-to-pem');

const goodIdToken1 =
  'eyJraWQiOiJvUnFkdDJndHg4YnJFOXBZN3JkRUpqdlVqa1M4b0N6RnhzTHQ3NGFKcXlVPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiaTNQUVJrVHRQQ3Zyejl4eGo3dVZtQSIsInN1YiI6Ijk5NDA2N2NmLTk5ZDEtNDRkOS1iNTY2LTI0OWRiMjE2YzQzOSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9Zbjg5eUtpem4iLCJjb2duaXRvOnVzZXJuYW1lIjoiOTk0MDY3Y2YtOTlkMS00NGQ5LWI1NjYtMjQ5ZGIyMTZjNDM5IiwiYXVkIjoiNmt0dDBtdHBrczAzcjhzZnRpY2MzaDFvNiIsImV2ZW50X2lkIjoiNGEwZDJhODQtYjE2NS0xMWU4LWE3NTktMGQ4ZmM4YzI5ZTBlIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1MzYxOTA5MjIsIm5pY2tuYW1lIjoiRG91ZyBGZWQiLCJleHAiOjE1MzYxOTQ1MjIsImlhdCI6MTUzNjE5MDkyMiwiZW1haWwiOiJkb3VnbGFzbmFwaGFzQGdtYWlsLmNvbSJ9.U1b0GyCF1Zzs2GbFKYrKnSC4QvhDhaGkUs0KO9EbnurBS6ThBxnWV9rolJIuxwEiUmRwPflgxPbIChjMDKotptqblh8HT14WgyNQZwmPkz9_efLq-loT6BOIujhNYXm0m6IeZpxEIzlbpSS3pIcnsbjKEElwQb6rASzBuI1TgqxHoWHK58hodZ2XRDcKKZjqYCnYIIy4FTnoK9GRVTPSwHzGnGSW3yDWVAN9VpLkt0G38s8rkLVmw_WdZo95DkgIdp51AfTG33Ha7A7cjzv8vSMl66XgEq02bV70EysO_8uMlohVNhFvui0xOAJmPbZYgn9TzHvQO6n5wEz3rRSeRQ';
const goodJwks1 = {
  keys: [
    {
      alg: 'RS256',
      e: 'AQAB',
      kid: 'oRqdt2gtx8brE9pY7rdEJjvUjkS8oCzFxsLt74aJqyU=',
      kty: 'RSA',
      n:
        'piLNuvF_s8Pltqbvhl4jacldyWHKsPqpqwfRDmlmDfgyUPPkH2xI1mM2ez19xgk6EV2u1WgqDUrbLZOg3LoIwGqg7ZKCEL9hFxbPmfZo-YungyeU2MtjdjDYJmG1MNpBf2AmZxDplOmlGKzHzskMHn86GrNPNCJWhrzWa-G3QPtpOmK9AMMVf-nphHuvp7Pog0yirE8qf88C4ECkYUqDQpRIG6i4rruBa--lTRp8BYJ_G4Hn07VJi1nwXTcms8qmHHE0uVSx0e58YG3Qw9ijGf3WZ5SiczWfSrAYwfr9KdaHstOfLhSL5Jt7qpeO0K31G8si1oPLITLUX1oVcW6kZQ',
      use: 'sig'
    },
    {
      alg: 'RS256',
      e: 'AQAB',
      kid: 'uTryj5OLEcTmz+jRWybXfH55IBgKi9hrkyc5S6oEU3A=',
      kty: 'RSA',
      n:
        'lQ_bci9EYeWFNodR37DyZ9WU2fvBbqzhQMAEGtvNxT6or_Rp687REhxWLDcUAPPrTOjKV5ZF8yPv-fIg921GTgmGL8kzg0MxD9-SuxO1PvNopVPVrLH7GL-gFj3Qj4SeTQHQMFYYPrZIQGcuOsz1LpgMSjNOw1qohfIo39lK7EO_GAfOgMpEKgE1tNg2AGIvrMJkTTUSQfwXVY1XZu0OmoR4xi6gbhHcqDq8M57s09c77kqyo5NhpaoDYfuJu1oA2DsjWHKmN84PIc-44ec7Eo7miFsgk5rZVH41r8rj-t8j7RudVMBYdoYtFzr9l_eADnRsytLILUl5yxs1IC73qw',
      use: 'sig'
    }
  ]
};

describe('checkJwt', () => {
  test('should reject if passed falsey, falsey', () => {
    expect.assertions(2);
    return Identity.checkJwt(undefined, null).catch(err => {
      expect(err).not.toBeNull();
      expect(err).toEqual(expect.stringMatching(/bad jwt/));
    });
  });
  test('should reject if passed jwt, falsey jwks', () => {
    expect.assertions(2);
    return Identity.checkJwt(goodIdToken1, undefined).catch(err => {
      expect(err).not.toBeNull();
      expect(err).toEqual(expect.stringMatching(/bad JWKs/));
    });
  });
  test('should reject if passed falsey jwt, valid jwks', () => {
    expect.assertions(2);
    return Identity.checkJwt(null, goodJwks1).catch(err => {
      expect(err).not.toBeNull();
      expect(err).toEqual(expect.stringMatching(/bad jwt/));
    });
  });
  test('valid JWT, key in JWKs', () => {
    let b = false;
    const f = () => {
      b = true;
    };
    const c = function(eff) {
      eff();
    };
    c(f);
    console.log(b);

    // mock verify() to call its 3rd arg with a null err and valid token 2nd
    // arg
    // jest.doMock('jsonwebtoken', () => {
    //   verify: () => {
    //     console.log('verify called');
    //   };
    // });

    // const jwt = require('jsonwebtoken');

    jest.mock('jsonwebtoken');
    const jwt = require('jsonwebtoken');

    expect.assertions(1);
    return Identity.checkJwt(goodIdToken1, goodJwks1).then(jot => {
      expect(jot).not.toBeNull();
    });
  });
  test('valid JWT, key not in JWKs', () => {});
});
