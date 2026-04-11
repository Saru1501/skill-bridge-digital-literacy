const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");

// Wait for DB to be ready before any tests run
beforeAll(async () => {
  await app.dbReady;
});

afterAll(async () => {
  // Clean up test data
  try {
    await mongoose.connection.collection("users").deleteMany({
      email: { $in: ["admin_test@gmail.com", "student_test@gmail.com", "other@gmail.com"] },
    });
    if (courseId) {
      const oid = new mongoose.Types.ObjectId(courseId);
      await mongoose.connection.collection("courses").deleteOne({ _id: oid });
      await mongoose.connection.collection("lessons").deleteMany({ course: oid });
      await mongoose.connection.collection("enrollments").deleteMany({ course: oid });
      await mongoose.connection.collection("progresses").deleteMany({ course: oid });
      await mongoose.connection.collection("savedcourses").deleteMany({ course: oid });
    }
  } catch (e) {
    // ignore cleanup errors
  }
});

// ============================================================
// TEST DATA
// ============================================================
let adminToken = "";
let studentToken = "";
let courseId = "";
let lessonId = "";

const adminUser = {
  name: "Admin Test",
  email: "admin_test@gmail.com",
  password: "123456",
  role: "admin",
};

const studentUser = {
  name: "Student Test",
  email: "student_test@gmail.com",
  password: "123456",
  role: "student",
};

const testCourse = {
  title: "Basic Computer Skills",
  description: "Learn the fundamentals of using a computer",
  category: "Basic IT",
  level: "beginner",
  tags: ["computer", "basics"],
};

const testLesson = {
  title: "Introduction to Computers",
  description: "What is a computer",
  content: "A computer is an electronic device...",
  order: 1,
  duration: 15,
};

// ============================================================
// 1. AUTH TESTS
// ============================================================
describe("1. AUTH - Register & Login", () => {

  test("Register admin successfully", async () => {
    const res = await request(app).post("/api/auth/register").send(adminUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.data.role).toBe("admin");
    adminToken = res.body.token;
  });

  test("Register student successfully", async () => {
    const res = await request(app).post("/api/auth/register").send(studentUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.data.role).toBe("student");
    studentToken = res.body.token;
  });

  test("Fail on duplicate email", async () => {
    const res = await request(app).post("/api/auth/register").send(adminUser);
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("Login admin successfully", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: adminUser.email, password: adminUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    // refresh token to ensure latest
    adminToken = res.body.token;
  });

  test("Fail login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: adminUser.email, password: "wrongpassword" });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test("Fail login with non-existent email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "notexist@gmail.com", password: "123456" });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test("Get current user with valid token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(adminUser.email);
  });

  test("Fail get current user without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.statusCode).toBe(401);
  });
});

// ============================================================
// 2. COURSE TESTS
// ============================================================
describe("2. COURSES - CRUD Operations", () => {

  test("Admin can create course", async () => {
    const res = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(testCourse);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(testCourse.title);
    expect(res.body.data.isPublished).toBe(false);
    courseId = res.body.data._id;
  });

  test("Student cannot create course (403)", async () => {
    const res = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${studentToken}`)
      .send(testCourse);
    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  test("Fail create course without token (401)", async () => {
    const res = await request(app).post("/api/courses").send(testCourse);
    expect(res.statusCode).toBe(401);
  });

  test("Fail create course with missing required fields", async () => {
    const res = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Incomplete Course" });
    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });

  test("Admin can get all courses including unpublished", async () => {
    const res = await request(app)
      .get("/api/courses")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("Student only sees published courses", async () => {
    const res = await request(app)
      .get("/api/courses")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    const unpublished = res.body.data.filter((c) => !c.isPublished);
    expect(unpublished.length).toBe(0);
  });

  test("Search courses by keyword", async () => {
    const res = await request(app)
      .get("/api/courses?search=Basic Computer")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("Filter courses by category", async () => {
    const res = await request(app)
      .get("/api/courses?category=Basic IT")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("Pagination works correctly", async () => {
    const res = await request(app)
      .get("/api/courses?page=1&limit=5")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.page).toBe(1);
    expect(res.body.data.length).toBeLessThanOrEqual(5);
  });

  test("Admin can get single course by ID", async () => {
    const res = await request(app)
      .get(`/api/courses/${courseId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(courseId);
  });

  test("Student cannot see unpublished course (403)", async () => {
    const res = await request(app)
      .get(`/api/courses/${courseId}`)
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(403);
  });

  test("Returns 404 for invalid course ID", async () => {
    const res = await request(app)
      .get("/api/courses/000000000000000000000000")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });

  test("Admin can update course", async () => {
    const res = await request(app)
      .put(`/api/courses/${courseId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Updated Computer Skills" });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Updated Computer Skills");
  });

  test("Admin can publish course", async () => {
    const res = await request(app)
      .patch(`/api/courses/${courseId}/publish`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.isPublished).toBe(true);
  });

  test("Admin can unpublish course (toggle)", async () => {
    const res = await request(app)
      .patch(`/api/courses/${courseId}/publish`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.isPublished).toBe(false);
    // Re-publish for further tests
    await request(app)
      .patch(`/api/courses/${courseId}/publish`)
      .set("Authorization", `Bearer ${adminToken}`);
  });
});

// ============================================================
// 3. LESSON TESTS
// ============================================================
describe("3. LESSONS - CRUD Operations", () => {

  test("Admin can add lesson to course", async () => {
    const res = await request(app)
      .post(`/api/courses/${courseId}/lessons`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(testLesson);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(testLesson.title);
    lessonId = res.body.data._id;
  });

  test("Student cannot add lesson (403)", async () => {
    const res = await request(app)
      .post(`/api/courses/${courseId}/lessons`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send(testLesson);
    expect(res.statusCode).toBe(403);
  });

  test("Get all lessons for a course", async () => {
    const res = await request(app)
      .get(`/api/courses/${courseId}/lessons`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
  });

  test("Get single lesson by ID", async () => {
    const res = await request(app)
      .get(`/api/lessons/${lessonId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(lessonId);
  });

  test("Returns 404 for invalid lesson ID", async () => {
    const res = await request(app)
      .get("/api/lessons/000000000000000000000000")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });

  test("Admin can update lesson", async () => {
    const res = await request(app)
      .put(`/api/lessons/${lessonId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Updated Lesson Title" });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Updated Lesson Title");
  });

  test("Student cannot update lesson (403)", async () => {
    const res = await request(app)
      .put(`/api/lessons/${lessonId}`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ title: "Hacked Title" });
    expect(res.statusCode).toBe(403);
  });
});

// ============================================================
// 4. ENROLLMENT TESTS
// ============================================================
describe("4. ENROLLMENTS - Student Enrollment Flow", () => {

  test("Student can enroll in published course", async () => {
    const res = await request(app)
      .post(`/api/enrollments/${courseId}`)
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Enrolled successfully");
  });

  test("Student cannot enroll twice (400)", async () => {
    const res = await request(app)
      .post(`/api/enrollments/${courseId}`)
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("Student can get their enrollments", async () => {
    const res = await request(app)
      .get("/api/enrollments/my")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
  });

  test("Check enrollment status returns isEnrolled true", async () => {
    const res = await request(app)
      .get(`/api/enrollments/${courseId}/status`)
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.isEnrolled).toBe(true);
  });

  test("Admin can see all enrollments for a course", async () => {
    const res = await request(app)
      .get(`/api/enrollments/course/${courseId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
  });

  test("Student cannot see all enrollments for a course (403)", async () => {
    const res = await request(app)
      .get(`/api/enrollments/course/${courseId}`)
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(403);
  });
});

// ============================================================
// 5. PROGRESS TESTS
// ============================================================
describe("5. PROGRESS - Learning Progress Tracking", () => {

  test("Student can update lesson progress", async () => {
    const res = await request(app)
      .patch(`/api/progress/${courseId}/lessons/${lessonId}`)
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.completionPercentage).toBeGreaterThan(0);
  });

  test("Cannot update progress if not enrolled (403)", async () => {
    const newUser = await request(app)
      .post("/api/auth/register")
      .send({ name: "Other", email: "other@gmail.com", password: "123456", role: "student" });
    const otherToken = newUser.body.token;
    const res = await request(app)
      .patch(`/api/progress/${courseId}/lessons/${lessonId}`)
      .set("Authorization", `Bearer ${otherToken}`);
    expect(res.statusCode).toBe(403);
  });

  test("Student can get course progress", async () => {
    const res = await request(app)
      .get(`/api/progress/${courseId}`)
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.completionPercentage).toBeDefined();
  });

  test("Track offline download", async () => {
    const res = await request(app)
      .post(`/api/progress/${courseId}/download`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ resourceUrl: "https://res.cloudinary.com/test/sample.pdf" });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("Fail track download without resourceUrl (400)", async () => {
    const res = await request(app)
      .post(`/api/progress/${courseId}/download`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("Sync offline progress successfully", async () => {
    const res = await request(app)
      .post(`/api/progress/${courseId}/sync`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ completedLessons: [lessonId] });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Progress synced");
  });

  test("Fail sync without completedLessons array (400)", async () => {
    const res = await request(app)
      .post(`/api/progress/${courseId}/sync`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// ============================================================
// 6. SAVED COURSES TESTS
// ============================================================
describe("6. SAVED COURSES - Bookmarking", () => {

  test("Student can save a course", async () => {
    const res = await request(app)
      .post(`/api/saved/${courseId}`)
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.isSaved).toBe(true);
  });

  test("Student can get saved courses", async () => {
    const res = await request(app)
      .get("/api/saved")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
  });

  test("Student can unsave a course (toggle)", async () => {
    const res = await request(app)
      .post(`/api/saved/${courseId}`)
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.isSaved).toBe(false);
  });

  test("Fail save non-existent course (404)", async () => {
    const res = await request(app)
      .post("/api/saved/000000000000000000000000")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(404);
  });
});

// ============================================================
// 7. DELETE TESTS
// ============================================================
describe("7. DELETE - Cleanup Operations", () => {

  test("Student cannot delete lesson (403)", async () => {
    const res = await request(app)
      .delete(`/api/lessons/${lessonId}`)
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(403);
  });

  test("Admin can delete lesson", async () => {
    const res = await request(app)
      .delete(`/api/lessons/${lessonId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("Student cannot delete course (403)", async () => {
    const res = await request(app)
      .delete(`/api/courses/${courseId}`)
      .set("Authorization", `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(403);
  });

  test("Admin can delete course", async () => {
    const tempCourse = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ ...testCourse, title: "Temp Course To Delete" });
    const tempId = tempCourse.body.data._id;
    const res = await request(app)
      .delete(`/api/courses/${tempId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});