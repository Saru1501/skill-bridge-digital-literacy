const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../server");
const { connect, closeDatabase } = require("../../tests/setup");

// Mock connectDB to prevent server from trying to connect to real Mongo
jest.mock("../../src/config/db", () => jest.fn().mockResolvedValue(true));

jest.setTimeout(30000); // 30s timeout

// Mock Cloudinary to prevent real API calls
jest.mock("../utils/cloudinary", () => ({
  uploadToCloudinary: jest.fn().mockResolvedValue({
    url: "http://mock-res.com/test.pdf",
    publicId: "mock-id",
    size: 1024,
  }),
  deleteFromCloudinary: jest.fn().mockResolvedValue({}),
}));

beforeAll(async () => {
  await connect();
  await app.dbReady;
});

afterAll(async () => {
  await closeDatabase();
});

describe("Component 1 - Integration Tests", () => {
  let adminToken, studentToken, courseId, lessonId;

  const adminUser = { name: "Admin", email: "admin@test.com", password: "password123", role: "admin" };
  const studentUser = { name: "Student", email: "student@test.com", password: "password123", role: "student" };

  beforeAll(async () => {
    // Register users
    const adminRes = await request(app).post("/api/auth/register").send(adminUser);
    adminToken = adminRes.body.token;

    const studentRes = await request(app).post("/api/auth/register").send(studentUser);
    studentToken = studentRes.body.token;
  });

  describe("Course Management", () => {
    test("Admin can create, update and publish course", async () => {
      // Create
      const res = await request(app)
        .post("/api/courses")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ title: "Integration Course", description: "Desc", category: "Basic IT", level: "beginner" });
      
      expect(res.status).toBe(201);
      courseId = res.body.data._id;

      // Update
      const updRes = await request(app)
        .put(`/api/courses/${courseId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ title: "Updated Integration Course" });
      expect(updRes.body.data.title).toBe("Updated Integration Course");

      // Publish
      const pubRes = await request(app)
        .patch(`/api/courses/${courseId}/publish`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(pubRes.body.data.isPublished).toBe(true);
    });

    test("Student only sees published courses", async () => {
      const res = await request(app)
        .get("/api/courses")
        .set("Authorization", `Bearer ${studentToken}`);
      
      expect(res.status).toBe(200);
      const isEveryPublished = res.body.data.every(c => c.isPublished);
      expect(isEveryPublished).toBe(true);
    });
  });

  describe("Enrollment & Progress", () => {
    test("Student can enroll and prevent duplicate", async () => {
      // Create a lesson first so progress has something to work with later
      const lessonRes = await request(app)
        .post(`/api/courses/${courseId}/lessons`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ title: "Lesson 1", order: 1 });
      lessonId = lessonRes.body.data._id;

      // Enroll
      const res = await request(app)
        .post(`/api/enrollments/${courseId}`)
        .set("Authorization", `Bearer ${studentToken}`);
      expect(res.status).toBe(201);

      // Duplicate
      const dupRes = await request(app)
        .post(`/api/enrollments/${courseId}`)
        .set("Authorization", `Bearer ${studentToken}`);
      expect(dupRes.status).toBe(400); // Controller returns 400 for 'Already enrolled'
    });

    test("Student can re-enroll after unenrolling", async () => {
      const unenrollRes = await request(app)
        .delete(`/api/enrollments/${courseId}`)
        .set("Authorization", `Bearer ${studentToken}`);
      expect(unenrollRes.status).toBe(200);

      const reenrollRes = await request(app)
        .post(`/api/enrollments/${courseId}`)
        .set("Authorization", `Bearer ${studentToken}`);
      expect(reenrollRes.status).toBe(200);
      expect(reenrollRes.body.message).toBe("Re-enrolled successfully");

      const statusRes = await request(app)
        .get(`/api/enrollments/${courseId}/status`)
        .set("Authorization", `Bearer ${studentToken}`);
      expect(statusRes.status).toBe(200);
      expect(statusRes.body.isEnrolled).toBe(true);
    });

    test("Progress auto-updates on lesson completion", async () => {
      const res = await request(app)
        .patch(`/api/progress/${courseId}/lessons/${lessonId}`)
        .set("Authorization", `Bearer ${studentToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data.completedLessons).toContain(lessonId);
      // Since it's the only lesson (1/1), it should be 100%
      expect(res.body.data.completionPercentage).toBe(100);
      expect(res.body.courseCompleted).toBe(true);
    });
  });

  describe("Saved Courses", () => {
    test("Student can save and remove a course", async () => {
      // Save
      const res = await request(app)
        .post(`/api/saved/${courseId}`)
        .set("Authorization", `Bearer ${studentToken}`);
      expect(res.status).toBe(201);
      expect(res.body.isSaved).toBe(true);

      // Remove
      const remRes = await request(app)
        .post(`/api/saved/${courseId}`)
        .set("Authorization", `Bearer ${studentToken}`);
      expect(remRes.status).toBe(200);
      expect(remRes.body.isSaved).toBe(false);
    });
  });

  describe("Access Control", () => {
    test("Student cannot delete course", async () => {
      const res = await request(app)
        .delete(`/api/courses/${courseId}`)
        .set("Authorization", `Bearer ${studentToken}`);
      expect(res.status).toBe(403);
    });
  });
});
