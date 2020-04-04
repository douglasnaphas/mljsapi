/* globals expect, jest */
describe("sedersResponse", () => {
  const sedersResponse = require("./sedersResponse");
  test("should return middleware", () => {
    expect(typeof sedersResponse()).toEqual("function");
  });
  test("", () => {
    
  })
});