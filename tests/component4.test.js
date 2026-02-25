const request = require("supertest");
const app = require("../server");
const db = require("./setup");

beforeAll(async () => db.connect());
afterEach(async () => db.clearDatabase());
afterAll(async () => db.closeDatabase());

describe("Component 4 basic routes", () => {
  test("GET /api/sponsorship/health should work", async () => {
    const res = await request(app).get("/api/sponsorship/health");
    expect(res.statusCode).toBe(200);
  });

  test("GET /api/tickets/health should work", async () => {
    const res = await request(app).get("/api/tickets/health");
    expect(res.statusCode).toBe(200);
  });

  test("GET /api/payments/health should work", async () => {
    const res = await request(app).get("/api/payments/health");
    expect(res.statusCode).toBe(200);
  });
});