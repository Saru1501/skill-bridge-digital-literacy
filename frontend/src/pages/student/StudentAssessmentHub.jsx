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
    <div style={{ background: '#fff', minHeight: '100vh', padding: 32 }}>
      <div style={{ background: '#1E293B', borderRadius: 18, padding: 24, marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontWeight: 700, fontSize: 28 }}>Assessment Hub</h1>
      </div>

      {enrollments.length === 0 ? (
        <div className="card">
          <div className="empty-state" style={{padding: "80px 40px"}}>
             <div className="empty-state-icon">
               <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
             </div>
            <h3>No assessments available</h3>
            <p>Enroll in a course to unlock its specifically designed practical missions and quizzes.</p>
            <Link to="/browse" className="btn btn-primary" style={{marginTop:20}}>Browse Courses</Link>
          </div>
        </div>
      ) : (
        <div className="assessment-hub-grid">
          {enrollments.map((enrollment) => {
            const course = enrollment.course;
            return (
              <div key={enrollment._id} className="assessment-hub-card">
                <div style={{display:"flex", justifyContent:"space-between", marginBottom: 12}}>
                  <span className="course-card-tag">{course.category}</span>
                  <span className={"badge " + (enrollment.completionStatus==="completed"?"badge-green":"badge-yellow")}>
                    {enrollment.completionStatus.replace("_", " ")}
                  </span>
                </div>
                <h3>{course.title}</h3>
                <p>{course.description?.substring(0, 80) || "Access mission work, quizzes, and results for this course."}...</p>

                <div style={{display:"flex", gap:8, marginBottom:24, flexWrap:"wrap"}}>
                  <span className="badge badge-gray">{course.level}</span>
                  <span className="badge badge-gray">{course.totalLessons} lessons</span>
                </div>

                <div className="assessment-hub-card__actions">
                  <Link to={`/assessment/course/${course._id}/missions`} className="btn btn-secondary">Missions</Link>
                  <Link to={`/assessment/course/${course._id}/quizzes`} className="btn btn-secondary">Quizzes</Link>
                  <Link to={`/assessment/course/${course._id}/performance`} className="btn btn-primary">Performance Data</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
