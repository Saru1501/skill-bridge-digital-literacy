import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMySaved, toggleSave } from "../../services/api";

export default function SavedResources() {
  const [saved,   setSaved]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMySaved().then(r => setSaved(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (courseId) => {
    try { await toggleSave(courseId); setSaved(s => s.filter(i => i.course._id !== courseId)); } catch {}
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Saved Courses</h1>
          <p className="section-sub">{saved.length} saved courses</p>
        </div>
        <Link to="/browse" className="btn btn-primary">Browse More</Link>
      </div>

      {saved.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-icon"><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg></div>
          <h3>No saved courses</h3><p>Save courses while browsing to access them quickly.</p>
          <Link to="/browse" className="btn btn-primary">Browse Courses</Link>
        </div></div>
      ) : (
        <div className="courses-grid">
          {saved.map(item => {
            const c = item.course;
            return (
              <div className="course-card" key={item._id}>
                <div className="course-card-header"><span className="course-card-cat">{c.category}</span></div>
                <div className="course-card-body">
                  <h3 className="course-card-title">{c.title}</h3>
                  <p className="course-card-desc">{c.description?.substring(0,90)}...</p>
                  <div className="course-card-meta">
                    <span className="badge badge-blue">{c.level}</span>
                    <span className="badge badge-gray">{c.totalLessons} lessons</span>
                  </div>
                </div>
                <div className="course-card-footer">
                  <Link to={`/course/${c._id}`} className="btn btn-primary btn-sm" style={{flex:1,justifyContent:"center"}}>Open Course</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleUnsave(c._id)}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
