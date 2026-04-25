import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMySaved, toggleSave } from "../../services/api";

export default function SavedResources() {
  const [saved,   setSaved]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert,   setAlert]    = useState({ msg:"", type:"" });

  const flash = (msg, type="success") => { setAlert({msg, type}); setTimeout(()=>setAlert({msg:"",type:""}), 3000); };

  useEffect(() => {
    getMySaved().then(r => setSaved(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (courseId) => {
    try { 
      await toggleSave(courseId); 
      setSaved(s => s.filter(i => i.course._id !== courseId)); 
      flash("Course removed from saved collection.", "error");
    } catch {
      flash("Failed to remove course.", "error");
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div className="page-wrap" style={{ background: 'transparent', minHeight: '100vh', padding: 32 }}>
      <div className="section-header" style={{ background: 'var(--ocean-gradient)', borderRadius: 24, padding: '40px 32px', marginBottom: 32, boxShadow: 'var(--shadow-md)' }}>
        <div>
          <h1 className="section-title" style={{ color: '#fff', fontSize: 36 }}>Saved Courses</h1>
          <p className="section-sub" style={{ color: 'rgba(255,255,255,0.8)', marginTop: 8 }}>Your personal collection of learning materials.</p>
        </div>
      </div>

      {alert.msg && <div className={"alert alert-" + alert.type} style={{ position: 'fixed', top: 24, right: 24, zIndex: 1000, minWidth: 300, boxShadow: 'var(--shadow-lg)' }}>{alert.msg}</div>}

      {saved.length === 0 ? (
        <div className="card" style={{ border: 'none', background: 'var(--glass)', backdropFilter: 'blur(10px)' }}>
          <div className="empty-state">
            <div className="empty-state-icon" style={{ background: '#f1f5f9', color: '#64748b', border: 'none' }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            </div>
            <h3>No saved courses</h3>
            <p>You haven't saved any courses yet. Start exploring to build your collection.</p>
            <Link to="/browse" className="btn btn-primary" style={{ padding: '12px 24px' }}>Browse Courses</Link>
          </div>
        </div>
      ) : (
        <div className="courses-grid">
          {saved.map(item => {
            const c = item.course;
            if (!c) return null;
            return (
              <div className="course-card" key={item._id} style={{ border: 'none', background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                <div className="course-card-header">
                  <span className="course-card-tag" style={{ background: '#eff6ff', color: '#2563eb', border: 'none', fontWeight: 600 }}>{c.category}</span>
                </div>
                <div className="course-card-body">
                  <h3 className="course-card-title" style={{ fontSize: 20, marginBottom: 12 }}>{c.title}</h3>
                  <p className="course-card-desc" style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                    {c.description
                      ? `${c.description.substring(0, 90)}${c.description.length > 90 ? "..." : ""}`
                      : "Reopen this saved course and continue where you left off."}
                  </p>
                  <div className="course-card-meta" style={{ display: 'flex', gap: 12 }}>
                    <span className="badge" style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>{c.level}</span>
                    <span className="badge" style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>{c.totalLessons} lessons</span>
                  </div>
                </div>
                <div className="course-card-footer" style={{ borderTop: '1px solid #f1f5f9', padding: '20px 24px', display:'flex', gap:10 }}>
                  <Link to={`/course/${c._id}`} className="btn btn-secondary" style={{ flex: 1, height: 42 }}>Details</Link>
                  <button className="btn btn-danger" style={{ height: 42, padding: '0 20px' }} onClick={() => handleUnsave(c._id)}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
