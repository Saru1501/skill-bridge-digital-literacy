const http = require("http");
const https = require("https");

const getBaseUrl = (context) =>
  process.env.ARTILLERY_TARGET ||
  context?.config?.target ||
  "http://localhost:3001";

const requestJson = (urlString, options = {}) =>
  new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const transport = url.protocol === "https:" ? https : http;
    const body = options.body ? JSON.stringify(options.body) : undefined;

    const req = transport.request(
      url,
      {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...(body ? { "Content-Length": Buffer.byteLength(body) } : {}),
          ...(options.headers || {}),
        },
      },
      (res) => {
        let raw = "";

        res.on("data", (chunk) => {
          raw += chunk;
        });

        res.on("end", () => {
          let data = {};

          if (raw) {
            try {
              data = JSON.parse(raw);
            } catch {
              data = { raw };
            }
          }

          resolve({ status: res.statusCode, data });
        });
      }
    );

    req.on("error", reject);

    if (body) {
      req.write(body);
    }

    req.end();
  });

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

async function ensureUser(baseUrl, user) {
  await requestJson(`${baseUrl}/api/auth/register`, {
    method: "POST",
    body: user,
  }).catch(() => null);

  const loginRes = await requestJson(`${baseUrl}/api/auth/login`, {
    method: "POST",
    body: {
      email: user.email,
      password: user.password,
    },
  });

  if (!loginRes?.data?.token) {
    throw new Error(
      `Failed to authenticate ${user.email}: ${loginRes?.status} ${JSON.stringify(loginRes?.data || {})}`
    );
  }

  return loginRes.data.token;
}

async function ensureTestCourse(baseUrl, adminToken, studentToken) {
  let coursesRes = await requestJson(`${baseUrl}/api/courses`, {
    headers: authHeaders(studentToken),
  });

  if (!Array.isArray(coursesRes.data?.data) || coursesRes.data.data.length === 0) {
    const newCourseRes = await requestJson(`${baseUrl}/api/courses`, {
      method: "POST",
      headers: authHeaders(adminToken),
      body: {
        title: "Performance Test Course",
        description: "Load-test fixture for learning management APIs",
        category: "Basic IT",
        level: "beginner",
      },
    });

    const createdCourseId = newCourseRes.data?.data?._id;
    if (!createdCourseId) {
      throw new Error(`Failed to create test course: ${JSON.stringify(newCourseRes.data || {})}`);
    }

    await requestJson(`${baseUrl}/api/courses/${createdCourseId}/publish`, {
      method: "PATCH",
      headers: authHeaders(adminToken),
      body: {},
    });

    coursesRes = await requestJson(`${baseUrl}/api/courses`, {
      headers: authHeaders(studentToken),
    });
  }

  const course = coursesRes.data.data[0];
  if (!course?._id) {
    throw new Error("No published course available for performance scenario");
  }

  let lessonsRes = await requestJson(`${baseUrl}/api/courses/${course._id}/lessons`, {
    headers: authHeaders(studentToken),
  });

  if (!Array.isArray(lessonsRes.data?.data) || lessonsRes.data.data.length === 0) {
    const lessonRes = await requestJson(`${baseUrl}/api/courses/${course._id}/lessons`, {
      method: "POST",
      headers: authHeaders(adminToken),
      body: {
        title: "Load Test Lesson 1",
        description: "Fixture lesson for performance testing",
        content: "Lesson body",
        order: 1,
        duration: 10,
      },
    });

    if (!lessonRes.data?.data?._id) {
      throw new Error(`Failed to create test lesson: ${JSON.stringify(lessonRes.data || {})}`);
    }

    lessonsRes = await requestJson(`${baseUrl}/api/courses/${course._id}/lessons`, {
      headers: authHeaders(studentToken),
    });
  }

  const lesson = lessonsRes.data.data[0];
  if (!lesson?._id) {
    throw new Error("No lesson available for performance scenario");
  }

  return {
    courseId: course._id,
    lessonId: lesson._id,
  };
}

async function beforeScenario(context, events) {
  const baseUrl = getBaseUrl(context);

  try {
    const studentToken = await ensureUser(baseUrl, {
      name: "Artillery Test Student",
      email: "student_test@gmail.com",
      password: "password123",
      role: "student",
    });

    const adminToken = await ensureUser(baseUrl, {
      name: "Artillery Admin",
      email: "admin_test@gmail.com",
      password: "password123",
      role: "admin",
    });

    const { courseId, lessonId } = await ensureTestCourse(baseUrl, adminToken, studentToken);

    context.vars.token = studentToken;
    context.vars.courseId = courseId;
    context.vars.lessonId = lessonId;
  } catch (error) {
    events.emit("error", error);
    console.error("Artillery setup error:", error.message);
  }
}

module.exports = { beforeScenario };
