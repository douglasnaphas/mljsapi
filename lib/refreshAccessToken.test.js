/* globals expect, jest */
describe("refreshAccessToken", () => {
  const Configs = require("../Configs");
  beforeEach(() => {jest.resetModules();})
  test.skip("use axios", async () => { // example test, skipped
    const refreshAccessToken = require("./refreshAccessToken");
    const data = await refreshAccessToken();
    expect(data.id).toEqual(1);
  });
  test.skip("mock axios", async () => { // example test, skipped
    jest.mock("axios");
    const axios = require("axios");
    const refreshAccessToken = require("./refreshAccessToken");
    const mockGet = () => {
      return new Promise((resolve, reject) => {resolve({data:{id:2}})}
    )};
    axios.get.mockImplementation(() => Promise.resolve({data: {id: 2}}));
    const data = await refreshAccessToken();
    expect(data.id).toEqual(2);
  });
  test("should use the refresh token to get a new access token 1", async () => {
    jest.mock("axios");
    const axios = require("axios");
    const refreshAccessToken = require("./refreshAccessToken");
    const refreshToken = "someToken.839.fjdlak";
    const clientSecret = 'fjkeia82398fasdkla';
    const mockData = {
      id_token: "abcde.fjg.hijklkm",
      access_token: "890fajldAFN.3290fjak.NMV230da8==",
      expires_in: 3600,
      token_type: "Bearer"
    };
    const authorization = "Basic " + Buffer.from(
      `${Configs.CognitoClientID()}:${clientSecret}`)
      .toString('base64');
    axios.get.mockImplementation((url, config) => {
      if(url !== Configs.CognitoTokenEndpointURL()) {
        throw "wrong CognitoTokenEndpointURL";
      }
      if(!config) {
        throw "no config provided";
      }
      if(!config.headers) {
        throw "no config headers";
      }
      if(!config.headers["Content-Type"]) {
        throw "no Content-Type header";
      }
      if(config.headers["Content-Type"] !==
        "application/x-www-form-urlencoded") {
        throw `Content-Type should be 'application/x-www-form-urlencoded', ` +
          `but it was ${config.headers["Content-Type"]}`;
      }
      if(config.method !== 'post') {
        throw `method should be post, got ${config.method}`
      }
      if(config.headers["Authorization"] !== authorization) {
        throw `wrong Authorization header, expect ${authorization}, got ` +
          `${config.headers["Authorization"]}`;
      }
      if(!config.data) {
        throw `no post body data`;
      }
      if(config.data["grant_type"] !== `refresh_token`) {
        throw `wrong grant_type, expect refresh_token, got ` +
          `${config.data["grant_type"]}`;
      }
      if(config.data["client_id"] !== Configs.CognitoClientID()) {
        throw `wrong client_id, expect ${Configs.CognitoClientID()}, got ` +
          `${config.data["client_id"]}`
      }
      if(config.data["refresh_token"] !== refreshToken) {
        throw `wrong refresh_token, expect ${refreshToken}, got ` +
          `${config.data["refresh_token"]}`;
      }
      return Promise.resolve({data: mockData});
    });
    const receivedData = await refreshAccessToken(refreshToken, clientSecret);
    expect(receivedData.access_token).toEqual(mockData.access_token);
  });
  test("should use the refresh token to get a new access token 2",
    async () => {
    jest.mock("axios");
    const axios = require("axios");
    const refreshAccessToken = require("./refreshAccessToken");
    const refreshToken = "differetToken.FDSFJLjfdsa839.xfa8940liM";
    const clientSecret = 'RUWFJALDK9fsecret2398fasdk74839439x';
    const mockData = {
      id_token: "48fjjkisabcde.fasd4ffsd.90jfdjklkm",
      access_token: "vvvjk89M2fajldAFN.3290fj4234ak.NMfasdfdV230da8==",
      expires_in: 7200,
      token_type: "Bearer"
    };
    const authorization = "Basic " + Buffer.from(
      `${Configs.CognitoClientID()}:${clientSecret}`)
      .toString('base64');
    axios.get.mockImplementation((url, config) => {
      if(url !== Configs.CognitoTokenEndpointURL()) {
        throw "wrong CognitoTokenEndpointURL";
      }
      if(!config) {
        throw "no config provided";
      }
      if(!config.headers) {
        throw "no config headers";
      }
      if(!config.headers["Content-Type"]) {
        throw "no Content-Type header";
      }
      if(config.headers["Content-Type"] !==
        "application/x-www-form-urlencoded") {
        throw `Content-Type should be 'application/x-www-form-urlencoded', ` +
          `but it was ${config.headers["Content-Type"]}`;
      }
      if(config.method !== 'post') {
        throw `method should be post, got ${config.method}`
      }
      if(config.headers["Authorization"] !== authorization) {
        throw `wrong Authorization header, expect ${authorization}, got ` +
          `${config.headers["Authorization"]}`;
      }
      if(!config.data) {
        throw `no post body data`;
      }
      if(config.data["grant_type"] !== `refresh_token`) {
        throw `wrong grant_type, expect refresh_token, got ` +
          `${config.data["grant_type"]}`;
      }
      if(config.data["client_id"] !== Configs.CognitoClientID()) {
        throw `wrong client_id, expect ${Configs.CognitoClientID()}, got ` +
          `${config.data["client_id"]}`
      }
      if(config.data["refresh_token"] !== refreshToken) {
        throw `wrong refresh_token, expect ${refreshToken}, got ` +
          `${config.data["refresh_token"]}`;
      }
      return Promise.resolve({data: mockData});
    });
    const receivedData = await refreshAccessToken(refreshToken, clientSecret);
    expect(receivedData.access_token).toEqual(mockData.access_token);
      
  });
  test("failed post",
    async () => {
      
      
  });
});