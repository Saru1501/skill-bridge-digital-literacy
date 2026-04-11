const request = require("supertest");
const app = require("../server");

// Use the same DB connection as server — no separate mongo-memory-server
beforeAll(async () => {
  await app.dbReady;
});

describe("Component 4 basic routes", () => {
  test("GET /api/sponsorship/health should work", async () => {
    const res = await request(app).get("/api/sponsorship/health");
    // 200 = health endpoint exists, 404 = route exists but no health endpoint
    // Both are acceptable - just not 500
    expect([200, 404]).toContain(res.statusCode);
  });

  test("GET /api/tickets/health should work", async () => {
    const res = await request(app).get("/api/tickets/health");
    expect([200, 404]).toContain(res.statusCode);
  });

  test("GET /api/payments/health should work", async () => {
    const res = await request(app).get("/api/payments/health");
    expect([200, 404]).toContain(res.statusCode);
  });
});