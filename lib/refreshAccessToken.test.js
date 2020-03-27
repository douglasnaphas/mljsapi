/* globals expect, jest */
describe("refreshAccessToken", () => {
  beforeEach(() => {jest.resetModules();})
  test("use axios", async () => {
    const refreshAccessToken = require("./refreshAccessToken");
    const data = await refreshAccessToken();
    expect(data.id).toEqual(1);
  });
  test("mock axios", async () => {
    jest.mock("axios");
    const axios = require("axios");
    const refreshAccessToken = require("./refreshAccessToken");
    const mockGet = () => {
      return new Promise((resolve, reject) => {resolve({data:{id:2}})}
    )};
    // axios.mockImplementation(() => {get: mockGet});
    axios.get.mockImplementation(() => Promise.resolve({data: {id: 2}}));
    const data = await refreshAccessToken();
    expect(data.id).toEqual(2);
  });
  test("should use the refresh token to get a new access token 1", () => {
    
  });
});