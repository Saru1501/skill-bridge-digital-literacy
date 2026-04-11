import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function StudentDashboard() {
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

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: 'rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px'
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-6" style={cardStyle}>
            <div style={{ color: '#6a6a6a', fontSize: '14px' }}>Enrolled Courses</div>
            <div className="text-3xl font-semibold" style={{ color: '#ff385c' }}>{enrollments.length}</div>
          </div>
          <Link to="/student/gamification" className="p-6 hover:shadow-lg transition" style={cardStyle}>
            <div style={{ color: '#6a6a6a', fontSize: '14px' }}>My Points</div>
            <div className="text-3xl font-semibold" style={{ color: '#222222' }}>View →</div>
          </Link>
          <Link to="/student/leaderboard" className="p-6 hover:shadow-lg transition" style={cardStyle}>
            <div style={{ color: '#6a6a6a', fontSize: '14px' }}>My Rank</div>
            <div className="text-3xl font-semibold" style={{ color: '#222222' }}>Check →</div>
          </Link>
          <div className="p-6" style={cardStyle}>
            <div style={{ color: '#6a6a6a', fontSize: '14px' }}>Certificates</div>
            <div className="text-3xl font-semibold" style={{ color: '#222222' }}>0</div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6" style={{ color: '#222222', letterSpacing: '-0.18px' }}>My Courses</h2>
        {loading ? (
          <p style={{ color: '#6a6a6a' }}>Loading...</p>
        ) : enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <div key={enrollment._id} className="p-6" style={cardStyle}>
                <h3 className="font-semibold text-lg" style={{ color: '#222222' }}>{enrollment.course?.title || "Course"}</h3>
                <div className="mt-3">
                  <div style={{ color: '#6a6a6a', fontSize: '14px' }}>Status: {enrollment.completionStatus}</div>
                  <div className="mt-3 h-2 rounded-full" style={{ backgroundColor: '#f2f2f2' }}>
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${enrollment.course?.progress || 0}%`, backgroundColor: '#ff385c' }}
                    />
                  </div>
                </div>
                <Link
                  to={`/student/course/${enrollment.course?._id}`}
                  className="mt-4 block text-center py-2.5 rounded-lg transition hover:shadow-lg"
                  style={{ 
                    backgroundColor: '#222222', 
                    color: '#ffffff',
                    fontWeight: 500,
                    fontSize: '14px'
                  }}
                >
                  Continue Learning
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12" style={cardStyle}>
            <p style={{ color: '#6a6a6a', marginBottom: '16px' }}>You haven't enrolled in any courses yet.</p>
            <Link 
              to="/courses" 
              className="px-6 py-2.5 rounded-lg transition hover:shadow-lg"
              style={{ 
                backgroundColor: '#ff385c', 
                color: '#ffffff',
                fontWeight: 500,
                fontSize: '14px',
                display: 'inline-block'
              }}
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}