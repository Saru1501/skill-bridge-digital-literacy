import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyEnrollments } from "../../services/api";

export default function StudentAssessmentHub() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyEnrollments();
        setEnrollments(res.data.data || []);
      } catch {
        setEnrollments([]);
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
    <div>
      <div className="section-header" style={{ marginBottom: 28 }}>
        <div>
          <h1 className="section-title">Assessment & Evaluation Engine</h1>
          <p className="section-sub">Open missions, quizzes, and performance tracking for your enrolled courses.</p>
        </div>
      </div>

      {enrollments.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <h3>No enrolled courses yet</h3>
            <p>Enroll in a course first to start missions and quizzes.</p>
            <Link to="/browse" className="btn btn-primary">Browse Courses</Link>
          </div>
        </div>
      ) : (
        <div className="assessment-hub-grid">
          {enrollments.map((enrollment) => {
            const course = enrollment.course;
            return (
              <div key={enrollment._id} className="assessment-hub-card">
                <div className="assessment-hub-card__top">
                  <div>
                    <h3>{course.title}</h3>
                    <p>{course.description || "Access mission work, quizzes, and results for this course."}</p>
                  </div>
                  <span className="badge badge-blue">{course.category}</span>
                </div>

                <div className="assessment-hub-card__meta">
                  <span className="badge badge-gray">{course.level}</span>
                  <span className="badge badge-gray">{course.totalLessons} lessons</span>
                  <span className="badge badge-yellow">{enrollment.completionStatus.replace("_", " ")}</span>
                </div>

                <div className="assessment-hub-card__actions">
                  <Link to={`/assessment/course/${course._id}/missions`} className="btn btn-secondary btn-sm">Missions</Link>
                  <Link to={`/assessment/course/${course._id}/quizzes`} className="btn btn-secondary btn-sm">Quizzes</Link>
                  <Link to={`/assessment/course/${course._id}/performance`} className="btn btn-primary btn-sm">Performance</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
