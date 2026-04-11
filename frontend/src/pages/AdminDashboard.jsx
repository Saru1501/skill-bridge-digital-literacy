import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, usersRes] = await Promise.all([
        api.get("/courses"),
        api.get("/auth/users"),
      ]);
      setCourses(coursesRes.data.data || []);
      setUsers(usersRes.data.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex gap-4 mb-8">
          <Link
            to="/admin/gamification"
            className="px-6 py-3 rounded-lg transition hover:shadow-lg"
            style={{ 
              backgroundColor: '#ff385c', 
              color: '#ffffff',
              fontWeight: 500,
              fontSize: '14px',
              boxShadow: 'rgba(0,0,0,0.08) 0px 4px 12px'
            }}
          >
            🎮 Gamification Management
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div 
            className="p-6"
            style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '20px',
              boxShadow: 'rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px'
            }}
          >
            <div style={{ color: '#6a6a6a', fontSize: '14px' }}>Total Users</div>
            <div className="text-3xl font-semibold" style={{ color: '#ff385c' }}>{users.length}</div>
          </div>
          <div 
            className="p-6"
            style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '20px',
              boxShadow: 'rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px'
            }}
          >
            <div style={{ color: '#6a6a6a', fontSize: '14px' }}>Total Courses</div>
            <div className="text-3xl font-semibold" style={{ color: '#222222' }}>{courses.length}</div>
          </div>
          <div 
            className="p-6"
            style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '20px',
              boxShadow: 'rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px'
            }}
          >
            <Link to="/admin/gamification" style={{ color: '#6a6a6a', fontSize: '14px', textDecoration: 'none' }}>
              Manage Gamification →
            </Link>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4" style={{ color: '#222222', letterSpacing: '-0.18px' }}>Recent Courses</h2>
        {loading ? (
          <p style={{ color: '#6a6a6a' }}>Loading...</p>
        ) : (
          <div 
            style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: 'rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px'
            }}
          >
            <table className="w-full">
              <thead style={{ backgroundColor: '#f2f2f2' }}>
                <tr>
                  <th className="px-4 py-3 text-left" style={{ fontWeight: 600, color: '#222222', fontSize: '14px' }}>Title</th>
                  <th className="px-4 py-3 text-left" style={{ fontWeight: 600, color: '#222222', fontSize: '14px' }}>Category</th>
                  <th className="px-4 py-3 text-left" style={{ fontWeight: 600, color: '#222222', fontSize: '14px' }}>Price</th>
                  <th className="px-4 py-3 text-left" style={{ fontWeight: 600, color: '#222222', fontSize: '14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.slice(0, 5).map((course) => (
                  <tr key={course._id} style={{ borderTop: '1px solid #f2f2f2' }}>
                    <td className="px-4 py-3" style={{ color: '#222222', fontSize: '14px' }}>{course.title}</td>
                    <td className="px-4 py-3" style={{ color: '#222222', fontSize: '14px' }}>{course.category}</td>
                    <td className="px-4 py-3" style={{ color: '#222222', fontSize: '14px' }}>${course.price || 0}</td>
                    <td className="px-4 py-3">
                      <span 
                        style={{ 
                          padding: '4px 8px', 
                          borderRadius: '14px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: course.isPublished ? '#f2f2f2' : '#f2f2f2',
                          color: course.isPublished ? '#222222' : '#6a6a6a'
                        }}
                      >
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}