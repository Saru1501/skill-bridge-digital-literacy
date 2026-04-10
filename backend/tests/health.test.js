const request = require("supertest");
const app = require("../server");

beforeAll(async () => {
  await app.dbReady;
});

describe("API Health", () => {
  test("GET / should return 200", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});