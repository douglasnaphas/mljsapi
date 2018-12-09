const credChecker = require('./credChecker');

describe('credChecker, authorization middleware', () => {
  const idToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9' +
    '.eyJhdF9oYXNoIjoiaTNQUVJrVHRQQ3Zyejl4eGo3dVZtQSIsInN1YiI6Ijk5NDA2N2NmLTk5ZDEtNDRkOS1iNTY2LTI0OWRiMjE2YzQzOSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL3VzLWVhc3QtMV9Zbjg5eUtpem4iLCJjb2duaXRvOnVzZXJuYW1lIjoiOTk0MDY3Y2YtOTlkMS00NGQ5LWI1NjYtMjQ5ZGIyMTZjNDM5IiwiYXVkIjoiNmt0dDBtdHBrczAzcjhzZnRpY2MzaDFvNiIsImV2ZW50X2lkIjoiNGEwZDJhODQtYjE2NS0xMWU4LWE3NTktMGQ4ZmM4YzI5ZTBlIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1MzYxOTA5MjIsIm5pY2tuYW1lIjoiSGFzaCIsImV4cCI6MTU0Mjg5ODEwMSwiaWF0IjoxNTM2MTkwOTIyLCJlbWFpbCI6Imhhc2hAZXhhbXBsZS5jb20iLCJqdGkiOiIwMzEyNjI0MS1lNGE2LTQ1OTEtOThkYS05MzZjOGQ3NGRiMDUifQ' +
    '.ZVIobZ1aC-hwGOAUSAEqPmAmBD-hz-WJumyKUFb_TCU';
  const accessToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9' +
    '.eyJzdWIiOiI5OTQwNjdjZi05OWQxLTQ0ZDktYjU2Ni0yNDlkYjIxNmM0MzkiLCJldmVudF9pZCI6IjRhMGQyYTg0LWIxNjUtMTFlOC1hNzU5LTBkOGZjOGMyOWUwZSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4gb3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhdXRoX3RpbWUiOjE1MzYxOTA5MjIsImlzcyI6Imh0dHBzOi8vY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb20vdXMtZWFzdC0xX1luODl5S2l6biIsImV4cCI6MTU0Mjg5OTAwNSwiaWF0IjoxNTM2MTkwOTIyLCJ2ZXJzaW9uIjoyLCJqdGkiOiI3YTMxMTUwZS1lYmQ0LTQ3NmEtOTBkNi03ZjQ0NDM4Y2EzZjgiLCJjbGllbnRfaWQiOiJoYXNoOG50cGtzMDNyOHNmdGljYzNoMW82IiwidXNlcm5hbWUiOiI5OTQwNjdjZi05OWQxLTQ0ZDktYjU2Ni0yNDlkYjIxNmM0MzkifQ' +
    '.0wBmYZ20RC5Oi2I7a6lNh0VI6ahzJhTS6v36nu25Q6E';
  const user = {
    at_hash: 'i3PQRkTtPCvrz9xxj7uVmA',
    sub: '994067cf-99d1-44d9-b566-249db216c439',
    email_verified: true,
    iss: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Yn89yKizn',
    'cognito:username': '994067cf-99d1-44d9-b566-249db216c439',
    aud: '6ktt0mtpks03r8sfticc3h1o6',
    event_id: '4a0d2a84-b165-11e8-a759-0d8fc8c29e0e',
    token_use: 'id',
    auth_time: 1536190922,
    nickname: 'Hash',
    exp: 1542898101,
    iat: 1536190922,
    email: 'hash@example.com',
    jti: '03126241-e4a6-4591-98da-936c8d74db05'
  };

  test('no JWTs, should get 401', () => {
    const req = {
      get: () => {
        return undefined;
      },
      cookies: {}
    };
    let status401Set = false;
    let status401Sent = false;
    const res = {
      status: code => {
        if (code == 401) {
          status401Set = true;
          return res;
        } else {
          return undefined;
        }
      },
      send: () => {
        if (status401Set && !nextCalled) {
          status401Sent = true;
        }
      }
    };
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };
    credChecker({})(req, res, next);
    expect(status401Sent).toBeTruthy();
  });

  test('valid tokens in Authorization header and query, should advance', () => {
    const req = {
      get: header => {
        return { header: { Authorization: 'Bearer ' + accessToken } };
      },
      cookies: {}
    };
    let status401Set = false;
    let status401Sent = false;
    const res = {
      status: code => {
        if (code == 401) {
          status401Set = true;
          return res;
        } else {
          return undefined;
        }
      },
      send: () => {
        if (status401Set && !nextCalled) {
          status401Sent = true;
        }
      }
    };
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };
    credChecker({})(req, res, next);
  });
});
