import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function NgoDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data.data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
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
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#222222', letterSpacing: '-0.18px' }}>NGO Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6" style={cardStyle}>
            <div style={{ color: '#6a6a6a', fontSize: '14px' }}>Total Courses</div>
            <div className="text-3xl font-semibold" style={{ color: '#ff385c' }}>{courses.length}</div>
          </div>
          <div className="p-6" style={cardStyle}>
            <div style={{ color: '#6a6a6a', fontSize: '14px' }}>Active Students</div>
            <div className="text-3xl font-semibold" style={{ color: '#222222' }}>View →</div>
          </div>
          <Link to="/ngo/courses" className="p-6 hover:shadow-lg transition" style={cardStyle}>
            <div style={{ color: '#6a6a6a', fontSize: '14px' }}>Manage Courses</div>
            <div className="text-3xl font-semibold" style={{ color: '#222222' }}>→</div>
          </Link>
        </div>
      </div>
    </div>
  );
}