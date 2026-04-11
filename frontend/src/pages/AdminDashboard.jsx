import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes] = await Promise.all([
        api.get("/courses"),
      ]);
      setCourses(coursesRes.data.data || []);
      setUsers([]);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f6f6f3' }}>
      <nav className="nav-glass">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link to="/admin" style={{ fontSize: '20px', fontWeight: 700, color: '#ff385c' }}>SkillBridge</Link>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/admin" style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: '#e5e5e0', color: '#211922', fontWeight: 600, fontSize: '14px' }}>Dashboard</Link>
              <Link to="/admin/gamification" style={{ padding: '8px 16px', borderRadius: '20px', color: '#211922', fontWeight: 500, fontSize: '14px' }}>Gamification</Link>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#62625b', fontSize: '14px' }}>{user?.name}</span>
            <button onClick={handleLogout} className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ padding: '32px 16px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '24px' }}>Admin Dashboard</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '13px', color: '#62625b' }}>Total Courses</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#211922' }}>{courses.length}</div>
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <Link to="/admin/gamification" style={{ fontSize: '13px', color: '#62625b', textDecoration: 'none' }}>Manage Gamification →</Link>
          </div>
        </div>

        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>Recent Courses</h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#62625b' }}>Loading...</div>
        ) : courses.length > 0 ? (
          <div className="card" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f6f6f3' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#211922' }}>Title</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#211922' }}>Category</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#211922' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.slice(0, 5).map((course) => (
                  <tr key={course._id} style={{ borderTop: '1px solid #e5e5e0' }}>
                    <td style={{ padding: '16px', color: '#211922' }}>{course.title}</td>
                    <td style={{ padding: '16px', color: '#62625b' }}>{course.category}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '4px 12px', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        backgroundColor: course.isPublished ? '#e6f4ea' : '#f6f6f3',
                        color: course.isPublished ? '#137333' : '#62625b'
                      }}>
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#62625b' }}>No courses found.</p>
          </div>
        )}
      </div>
    </div>
  );
}