const request = require("supertest");
const { connect, closeDatabase } = require("./setup");

jest.mock("../src/config/db", () => jest.fn().mockResolvedValue(true));
jest.mock("../src/utils/cloudinary", () => ({
  uploadToCloudinary: jest.fn().mockResolvedValue({
    url: "https://mock-cdn.local/resource.pdf",
    publicId: "mock-resource-id",
    version: "1",
    resourceType: "image",
    size: 1024,
  }),
  deleteFromCloudinary: jest.fn().mockResolvedValue({}),
}));

const app = require("../server");

jest.setTimeout(30000);

describe("Component 1 - Learning Management & Offline Delivery Engine", () => {
  let adminToken;
  let studentToken;
  let courseId;
  let firstLessonId;
  let secondLessonId;
  let resourceId;

  const adminUser = {
    name: "Component Admin",
    email: "component1-admin@test.com",
    password: "password123",
    role: "admin",
  };

  const studentUser = {
    name: "Component Student",
    email: "component1-student@test.com",
    password: "password123",
    role: "student",
  };

  beforeAll(async () => {
    await connect();
    await app.dbReady;

    const adminRegister = await request(app).post("/api/auth/register").send(adminUser);
    adminToken = adminRegister.body.token;

    const studentRegister = await request(app).post("/api/auth/register").send(studentUser);
    studentToken = studentRegister.body.token;
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test("registers and authenticates component users", async () => {
    const loginRes = await request(app).post("/api/auth/login").send({
      email: adminUser.email,
      password: adminUser.password,
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();

    const meRes = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.email).toBe(studentUser.email);
    expect(meRes.body.data.role).toBe("Student");
  });

  test("supports admin course CRUD and student visibility rules", async () => {
    const createRes = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Digital Literacy Foundations",
        description: "Core digital literacy content for rural youth",
        category: "Basic IT",
        level: "beginner",
        tags: ["digital literacy", "basics"],
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);
    expect(createRes.body.data.isPublished).toBe(false);
    courseId = createRes.body.data._id;

    const hiddenRes = await request(app)
      .get(`/api/courses/${courseId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(hiddenRes.status).toBe(403);

    const updateRes = await request(app)
      .put(`/api/courses/${courseId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Digital Literacy Foundations Updated" });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.title).toBe("Digital Literacy Foundations Updated");

    const publishRes = await request(app)
      .patch(`/api/courses/${courseId}/publish`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(publishRes.status).toBe(200);
    expect(publishRes.body.data.isPublished).toBe(true);

    const browseRes = await request(app)
      .get("/api/courses?search=Digital Literacy&category=Basic IT")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(browseRes.status).toBe(200);
    expect(browseRes.body.data.some((course) => course._id === courseId)).toBe(true);
    expect(browseRes.body.data.every((course) => course.isPublished)).toBe(true);
  });

  test("supports lesson creation, resource upload, lesson viewing, and resource deletion", async () => {
    const firstLessonRes = await request(app)
      .post(`/api/courses/${courseId}/lessons`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Introduction to Devices",
        description: "Understand basic digital devices",
        content: "Lesson content 1",
        order: 1,
        duration: 15,
      });

    expect(firstLessonRes.status).toBe(201);
    firstLessonId = firstLessonRes.body.data._id;

    const secondLessonRes = await request(app)
      .post(`/api/courses/${courseId}/lessons`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Internet Safety Essentials",
        description: "Safe browsing basics",
        content: "Lesson content 2",
        order: 2,
        duration: 20,
      });

    expect(secondLessonRes.status).toBe(201);
    secondLessonId = secondLessonRes.body.data._id;

    const uploadRes = await request(app)
      .post(`/api/lessons/${firstLessonId}/resources`)
      .set("Authorization", `Bearer ${adminToken}`)
      .field("name", "Offline Guide")
      .field("type", "pdf")
      .field("isDownloadable", "true")
      .attach("file", Buffer.from("%PDF-1.4 test"), "offline-guide.pdf");

    expect(uploadRes.status).toBe(201);
    expect(uploadRes.body.data.resources).toHaveLength(1);
    resourceId = uploadRes.body.data.resources[0]._id;

    const listLessonsRes = await request(app)
      .get(`/api/courses/${courseId}/lessons`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(listLessonsRes.status).toBe(200);
    expect(listLessonsRes.body.count).toBe(2);

    const lessonDetailRes = await request(app)
      .get(`/api/lessons/${firstLessonId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(lessonDetailRes.status).toBe(200);
    expect(lessonDetailRes.body.data.resources[0]._id).toBe(resourceId);

    const deleteResourceRes = await request(app)
      .delete(`/api/lessons/${firstLessonId}/resources/${resourceId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(deleteResourceRes.status).toBe(200);
    expect(deleteResourceRes.body.success).toBe(true);
  });

  test("supports enrollment, progress tracking, offline sync, downloads, and saved courses", async () => {
    const enrollRes = await request(app)
      .post(`/api/enrollments/${courseId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(enrollRes.status).toBe(201);
    expect(enrollRes.body.message).toBe("Enrolled successfully");

    const duplicateEnrollRes = await request(app)
      .post(`/api/enrollments/${courseId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(duplicateEnrollRes.status).toBe(400);

    const enrollmentsRes = await request(app)
      .get("/api/enrollments/my")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(enrollmentsRes.status).toBe(200);
    expect(enrollmentsRes.body.count).toBe(1);

    const statusRes = await request(app)
      .get(`/api/enrollments/${courseId}/status`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(statusRes.status).toBe(200);
    expect(statusRes.body.isEnrolled).toBe(true);

    const progressRes = await request(app)
      .patch(`/api/progress/${courseId}/lessons/${firstLessonId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(progressRes.status).toBe(200);
    expect(progressRes.body.data.completionPercentage).toBe(50);
    expect(progressRes.body.courseCompleted).toBe(false);

    const trackDownloadRes = await request(app)
      .post(`/api/progress/${courseId}/download`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ resourceUrl: "https://mock-cdn.local/resource.pdf" });

    expect(trackDownloadRes.status).toBe(200);
    expect(trackDownloadRes.body.data).toContain("https://mock-cdn.local/resource.pdf");

    const syncRes = await request(app)
      .post(`/api/progress/${courseId}/sync`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ completedLessons: [secondLessonId] });

    expect(syncRes.status).toBe(200);
    expect(syncRes.body.data.completionPercentage).toBe(100);
    expect(syncRes.body.data.isCourseCompleted).toBe(true);

    const courseProgressRes = await request(app)
      .get(`/api/progress/${courseId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(courseProgressRes.status).toBe(200);
    expect(courseProgressRes.body.data.completionPercentage).toBe(100);

    const saveRes = await request(app)
      .post(`/api/saved/${courseId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(saveRes.status).toBe(201);
    expect(saveRes.body.isSaved).toBe(true);

    const savedListRes = await request(app)
      .get("/api/saved")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(savedListRes.status).toBe(200);
    expect(savedListRes.body.count).toBe(1);

    const unsaveRes = await request(app)
      .post(`/api/saved/${courseId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(unsaveRes.status).toBe(200);
    expect(unsaveRes.body.isSaved).toBe(false);
  });

  test("enforces access control and supports lesson/course cleanup", async () => {
    const studentDeleteLessonRes = await request(app)
      .delete(`/api/lessons/${secondLessonId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(studentDeleteLessonRes.status).toBe(403);

    const adminDeleteLessonRes = await request(app)
      .delete(`/api/lessons/${secondLessonId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(adminDeleteLessonRes.status).toBe(200);

    const studentDeleteCourseRes = await request(app)
      .delete(`/api/courses/${courseId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(studentDeleteCourseRes.status).toBe(403);

    const adminDeleteCourseRes = await request(app)
      .delete(`/api/courses/${courseId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(adminDeleteCourseRes.status).toBe(200);
    expect(adminDeleteCourseRes.body.success).toBe(true);
  });
});
