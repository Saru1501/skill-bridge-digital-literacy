import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../../services/api";

export default function AdminAssessmentHub() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getCourses({ limit: 100 });
        setCourses(res.data.data || []);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div className="page-loading"><div className="spinner"></div></div>;
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 32 }}>
      <div style={{ background: '#1E293B', borderRadius: 18, padding: 24, marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontWeight: 700, fontSize: 28 }}>Assessment Hub</h1>
      </div>

      <div className="section-header" style={{ marginBottom: 28 }}>
        <div>
          <h1 className="section-title">Assessment & Evaluation Engine</h1>
          <p className="section-sub">Manage missions and quizzes for every course from one place.</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <h3>No courses available</h3>
            <p>Create a course first, then attach missions and quizzes to it.</p>
            <Link to="/admin/courses" className="btn btn-primary">Manage Courses</Link>
          </div>
        </div>
      ) : (
        <div className="assessment-hub-grid">
          {courses.map((course) => (
            <div key={course._id} className="assessment-hub-card">
              <div className="assessment-hub-card__top">
                <div>
                  <h3>{course.title}</h3>
                  <p>{course.description || "Configure missions and quizzes for this course."}</p>
                </div>
                <span className={"badge " + (course.isPublished ? "badge-green" : "badge-yellow")}>
                  {course.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <div className="assessment-hub-card__meta">
                <span className="badge badge-blue">{course.category}</span>
                <span className="badge badge-gray">{course.level}</span>
                <span className="badge badge-gray">{course.enrollmentCount || 0} enrolled</span>
              </div>

              <div className="assessment-hub-card__actions">
                <Link to={`/admin/assessment/course/${course._id}/missions`} className="btn btn-secondary btn-sm">Manage Missions</Link>
                <Link to={`/admin/assessment/course/${course._id}/quizzes`} className="btn btn-primary btn-sm">Manage Quizzes</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
