import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await api.get("/enrollments/my");
      setEnrollments(res.data.data || []);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { label: 'Home', icon: '🏠', path: '/student' },
    { label: 'Activity', icon: '🏆', path: '/student/gamification' },
    { label: 'Leaderboard', icon: '🥇', path: '/student/leaderboard' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f6f6f3' }}>
      <nav className="nav-glass">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link to="/student" style={{ fontSize: '20px', fontWeight: 700, color: '#ff385c' }}>SkillBridge</Link>
            <div style={{ display: 'flex', gap: '8px' }}>
              {navItems.map((item) => (
                <Link 
                  key={item.label}
                  to={item.path} 
                  style={{ padding: '8px 16px', borderRadius: '20px', color: '#211922', fontWeight: 500, fontSize: '14px' }}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#62625b', fontSize: '14px' }}>{user?.name}</span>
            <button onClick={handleLogout} className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ padding: '32px 16px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '24px' }}>Welcome back, {user?.name}!</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '13px', color: '#62625b' }}>Enrolled Courses</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#211922' }}>{enrollments.length}</div>
          </div>
          <Link to="/student/gamification" className="card" style={{ padding: '20px', textDecoration: 'none' }}>
            <div style={{ fontSize: '13px', color: '#62625b' }}>My Points</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#e60023' }}>View →</div>
          </Link>
          <Link to="/student/leaderboard" className="card" style={{ padding: '20px', textDecoration: 'none' }}>
            <div style={{ fontSize: '13px', color: '#62625b' }}>My Rank</div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#211922' }}>Check →</div>
          </Link>
        </div>

        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>My Courses</h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#62625b' }}>Loading...</div>
        ) : enrollments.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {enrollments.map((enrollment) => (
              <div key={enrollment._id} className="card" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{enrollment.course?.title || "Course"}</h3>
                <div style={{ fontSize: '14px', color: '#62625b', marginBottom: '12px' }}>Status: {enrollment.completionStatus}</div>
                <div style={{ height: '8px', backgroundColor: '#e5e5e0', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '0%', backgroundColor: '#e60023', borderRadius: '4px' }} />
                </div>
                <Link 
                  to={`/student/course/${enrollment.course?._id}`}
                  style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: '20px', backgroundColor: '#e60023', color: 'white', fontWeight: 500 }}
                >
                  Continue
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#62625b', marginBottom: '16px' }}>You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="btn-primary" style={{ display: 'inline-block' }}>Browse Courses</Link>
          </div>
        )}
      </div>
    </div>
  );
}