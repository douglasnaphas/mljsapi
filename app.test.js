const request = require("supertest");
const app = require("./app");

describe("app request-level tests", () => {
  describe("canary", () => {
    test("canary should return 200 with canary message", () => {
      return request(app)
        .get("/public-endpoint")
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.body.Output).toEqual("this endpoint is public");
        });
    });
  });
  describe("/login", () => {});
});
