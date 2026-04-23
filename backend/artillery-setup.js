const axios = require('axios');

// Function to seed user and course data before load tests
// This can be used in scenarios or as a standalone script
async function beforeScenario(context, events) {
  try {
    // Note: We assume the server is running and student_test@gmail.com exists
    // In a real environment, we'd ensure this in a global setup
    // 1. Try to Register first (ignoring error if already exists)
    await axios.post('http://localhost:3001/api/auth/register', {
      name: 'Artillery Test Student',
      email: 'student_test@gmail.com',
      password: 'password123',
      role: 'student'
    }).catch(() => null);

    // 2. Login
    const loginRes = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'student_test@gmail.com',
      password: 'password123'
    }).catch((err) => {
      console.error("Login failed:", err.response?.data || err.message);
      return null;
    });

    if (loginRes && loginRes.data.success) {
      context.vars.token = loginRes.data.token;
      
      let coursesRes = await axios.get('http://localhost:3001/api/courses', {
        headers: { Authorization: `Bearer ${context.vars.token}` }
      });

      // If no courses exist, login as admin and create one
      if (!coursesRes.data.data || coursesRes.data.data.length === 0) {
        // Try to register admin first
        await axios.post('http://localhost:3001/api/auth/register', {
          name: 'Artillery Admin',
          email: 'admin_test@gmail.com',
          password: 'password123',
          role: 'admin'
        }).catch(() => null);

        const adminLogin = await axios.post('http://localhost:3001/api/auth/login', {
          email: 'admin_test@gmail.com',
          password: 'password123'
        }).catch(() => null);

        if (adminLogin) {
          const adminToken = adminLogin.data.token;
          const newCourse = await axios.post('http://localhost:3001/api/courses', {
            title: "Performance Test Course",
            description: "Data for load testing",
            category: "Basic IT",
            level: "beginner"
          }, { headers: { Authorization: `Bearer ${adminToken}` } });

          const courseId = newCourse.data.data._id;
          await axios.patch(`http://localhost:3001/api/courses/${courseId}/publish`, {}, {
            headers: { Authorization: `Bearer ${adminToken}` }
          });

          await axios.post(`http://localhost:3001/api/courses/${courseId}/lessons`, {
            title: "Load Test Lesson 1",
            description: "content",
            order: 1
          }, { headers: { Authorization: `Bearer ${adminToken}` } });

          // Re-fetch courses
          coursesRes = await axios.get('http://localhost:3001/api/courses', {
            headers: { Authorization: `Bearer ${context.vars.token}` }
          });
        }
      }

      if (coursesRes.data.data && coursesRes.data.data.length > 0) {
        const course = coursesRes.data.data[0];
        context.vars.courseId = course._id;
        
        const lessonsRes = await axios.get(`http://localhost:3001/api/courses/${course._id}/lessons`, {
          headers: { Authorization: `Bearer ${context.vars.token}` }
        });

        if (lessonsRes.data.data && lessonsRes.data.data.length > 0) {
          context.vars.lessonId = lessonsRes.data.data[0]._id;
        }
      }
    }
  } catch (error) {
    console.error("Artillery setup error:", error.message);
  }
}

module.exports = { beforeScenario };
