/* globals expect, jest */
describe("getJwksConditionally", () => {
  beforeEach(() => {jest.resetModules();});
  const getJwksConditionally = require("./getJwksConditionally");
  test("mock a user module 1", () => {
    jest.mock('./getMadLnJwksFromAws', () => jest.fn(() => 'xy'));
    const getMadLnJwksFromAws = require("./getMadLnJwksFromAws");
    expect(getMadLnJwksFromAws()).toEqual('xy');
  });
  test("mock a user module 2", () => {
    jest.mock('./getMadLnJwksFromAws', () => jest.fn(() => 'zz'));
    const getMadLnJwksFromAws = require("./getMadLnJwksFromAws");
    expect(getMadLnJwksFromAws()).toEqual('zz');
  });
});