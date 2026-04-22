const request = require("supertest");
const app = require("../server");

beforeAll(async () => {
  await app.dbReady;
});

describe("Auth API", () => {
  test("POST /api/auth/register creates a user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test Student",
      email: "student@example.com",
      password: "secret123",
      role: "student",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeTruthy();
    expect(res.body.data.email).toBe("student@example.com");
    expect(res.body.data.role).toBe("Student");
  });

  test("POST /api/auth/register returns 409 for duplicate email", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Existing User",
      email: "duplicate@example.com",
      password: "secret123",
      role: "student",
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "Another User",
      email: "duplicate@example.com",
      password: "secret123",
      role: "student",
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("User already exists");
  });
});
