/* globals expect, jest */
describe("setDbParamsGetEmailFromSub", () => {
  const setDbParamsGetEmailFromSub = require("./setDbParamsGetEmailFromSub");
  test("should return middleware", () => {
    const middleware = setDbParamsGetEmailFromSub("user");
    expect(typeof middleware).toEqual("function");
  });
  test("should fail without the name of a local", () => {
    expect(
      () => {setDbParamsGetEmailFromSub();}
    ).toThrow();
  });
  test("returned middleware should set params for DynamoDB query to get " +
    "email addresses where the named local is in the partition key 1", () => {
      
  });
  test("returned middleware should set params for DynamoDB query to get " +
    "email addresses where the named local is in the partition key 2", () => {
      
  });
});