/* globals expect */
let Configs = require("./Configs");
describe("Configs/allowedOrigin", () => {
  const defaultAllowedOrigin = "https://madliberationgame.com";
  test(defaultAllowedOrigin, () => {
    expect(Configs.allowedOrigin(defaultAllowedOrigin)).toEqual(
      defaultAllowedOrigin
    );
  });
  test("https://madliberationgame.com.attacker.com", () => {
    const origin = "https://madliberationgame.com.attacker.com";
    expect(Configs.allowedOrigin(origin)).toEqual(defaultAllowedOrigin);
  });
  test("https://api.madliberationgame.com", () => {
    const origin = "https://api.madliberationgame.com";
    expect(Configs.allowedOrigin(origin)).toEqual(origin);
  });
  test("https://passover.lol.attacker.com", () => {
    const origin = "https://passover.lol.attacker.com";
    expect(Configs.allowedOrigin(origin)).toEqual(defaultAllowedOrigin);
  });
  test("https://www.passover.lol", () => {
    const origin = "https://www.passover.lol";
    expect(Configs.allowedOrigin(origin)).toEqual(origin);
  });
  test("https://passover.lol", () => {
    const origin = "https://passover.lol";
    expect(Configs.allowedOrigin(origin)).toEqual(origin);
  });
});
describe("Configs/CognitoRedirectURI", () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env.COGNITO_DEFAULT_REDIRECT_URI =
      "https://api.passover.lol/get-cookies";
    Configs = require("./Configs");
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
  });
  const defaultRedirectURI = "https://api.passover.lol/get-cookies";
  test("no host or protocol, should be https://api.passover.lol/get-cookies", () => {
    expect(Configs.CognitoRedirectURI()).toEqual(defaultRedirectURI);
  });
  test("no host, should use default", () => {
    expect(Configs.CognitoRedirectURI("http")).toEqual(defaultRedirectURI);
    expect(Configs.CognitoRedirectURI("https")).toEqual(defaultRedirectURI);
    expect(Configs.CognitoRedirectURI("ftp")).toEqual(defaultRedirectURI);
    expect(Configs.CognitoRedirectURI("")).toEqual(defaultRedirectURI);
    expect(Configs.CognitoRedirectURI("any scheme")).toEqual(
      defaultRedirectURI
    );
  });
  test.each`
    scheme     | host                           | expected
    ${"http"}  | ${"localhost:0001"}            | ${"http://localhost:0001/get-cookies"}
    ${"http"}  | ${"localhost"}                 | ${"http://localhost/get-cookies"}
    ${"http"}  | ${"localhost:4001"}            | ${"http://localhost:4001/get-cookies"}
    ${"http"}  | ${"localhost:4401"}            | ${"http://localhost:4401/get-cookies"}
    ${"https"} | ${"localhost:0001"}            | ${"https://localhost:0001/get-cookies"}
    ${"https"} | ${"localhost"}                 | ${"https://localhost/get-cookies"}
    ${"https"} | ${"localhost:4001"}            | ${"https://localhost:4001/get-cookies"}
    ${"https"} | ${"localhost:4401"}            | ${"https://localhost:4401/get-cookies"}
    ${"http"}  | ${"anything-but-localhost"}    | ${defaultRedirectURI}
    ${"https"} | ${"non-localhost"}             | ${defaultRedirectURI}
    ${"http"}  | ${"no-http-allowed"}           | ${defaultRedirectURI}
    ${"https"} | ${"xyz.com"}                   | ${defaultRedirectURI}
    ${"https"} | ${"api.madliberationgame.com"} | ${defaultRedirectURI}
    ${"https"} | ${"api.passover.lol"}          | ${defaultRedirectURI}
    ${"https"} | ${"api-dev.passover.lol"}      | ${"https://api-dev.passover.lol/get-cookies"}
    ${"http"}  | ${"api-dev.passover.lol"}      | ${"https://api-dev.passover.lol/get-cookies"}
  `(
    "scheme $scheme host $host should return $expected",
    ({ scheme, host, expected }) => {
      expect(Configs.CognitoRedirectURI(scheme, host)).toEqual(expected);
    }
  );
  test("if running on localhost, return host/get-cookies", () => {});
  test("if not running on localhost, return default", () => {});
});
