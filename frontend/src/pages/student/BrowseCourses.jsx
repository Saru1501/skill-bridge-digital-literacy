import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getCourses, enrollCourse, toggleSave, getMySaved } from "../../services/api";
import { getMyEnrollments } from "../../services/enrollment";

const CATEGORIES = ["","Basic IT","Internet Safety","Online Jobs","Digital Payments","Digital Tools"];
const LEVELS     = ["","beginner","intermediate","advanced"];

export default function BrowseCourses() {
  const [courses,  setCourses]  = useState([]);
  const [saved,    setSaved]    = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("");
  const [level,    setLevel]    = useState("");
  const [loading,  setLoading]  = useState(true);
  const [alert,    setAlert]    = useState({ msg:"", type:"" });

  const flash = (msg, type="success") => { setAlert({msg, type}); setTimeout(()=>setAlert({msg:"",type:""}), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search)   params.search   = search;
      if (category) params.category = category;
      if (level)    params.level    = level;
      const [cRes, sRes, eRes] = await Promise.all([
        getCourses(params),
        getMySaved(),
        getMyEnrollments()
      ]);
      setCourses(cRes.data.data || []);
      setSaved((sRes.data.data || []).map(s => s.course._id));
      setEnrolled((eRes || []).map(e => e.course._id));
    } catch { setCourses([]); setEnrolled([]); } finally { setLoading(false); }
  }, [search, category, level]);

  useEffect(() => { load(); }, [load]);

  const handleEnroll = async (courseId) => {
    try {
      const res = await enrollCourse(courseId);
      setEnrolled(current => current.includes(courseId) ? current : [...current, courseId]);
      flash(res?.data?.message || "Enrolled successfully! Check My Courses.");
    }
    catch (err) { flash(err?.response?.data?.message || "Enrollment failed", "error"); }
  };

const handleSave = async (courseId) => {
    try {
      const res = await toggleSave(courseId);
      if (res.data.isSaved) {
        setSaved(s => [...s, courseId]);
        flash("Course saved to your collection!");
      } else {
        setSaved(s => s.filter(id => id !== courseId));
        flash("Course removed from saved collection.", "error");
      }
    } catch {
      flash("Failed to update saved collection.", "error");
    }
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 32 }}>
      <div style={{ background: '#1E293B', borderRadius: 18, padding: 24, marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontWeight: 700, fontSize: 28 }}>Browse Courses</h1>
      </div>

      {alert.msg && <div className={"alert alert-" + alert.type}>{alert.msg}</div>}

      <div className="filters-bar">
        <div className="search-box">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input className="form-control" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} style={{paddingLeft:44}} />
        </div>
        <select className="filter-select" value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c || "All Categories"}</option>)}
        </select>
        <select className="filter-select" value={level} onChange={e => setLevel(e.target.value)}>
          {LEVELS.map(l => <option key={l} value={l}>{l ? l.charAt(0).toUpperCase()+l.slice(1) : "All Levels"}</option>)}
        </select>
      </div>

      {loading ? <div className="page-loading"><div className="spinner"></div></div> :
       courses.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-icon"><svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></div>
          <h3>No matching courses</h3><p>Try clearing your filters to see more content.</p>
          <button className="btn btn-primary" style={{marginTop:16}} onClick={() => { setSearch(""); setCategory(""); setLevel(""); }}>Clear All Filters</button>
        </div></div>
       ) : (
        <div className="courses-grid">
          {courses.map(c => {
            const isEnrolled = enrolled.includes(c._id);
            const isSaved = saved.includes(c._id);
            return (
              <div className="course-card" key={c._id} style={{ border: 'none', background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                <div className="course-card-header">
                  <span className="course-card-tag" style={{ background: '#eff6ff', color: '#2563eb', border: 'none', fontWeight: 600 }}>{c.category}</span>
                  {isEnrolled && (
                    <span style={{position:"absolute", right:24, top:24, background:"#d1fae5", borderRadius:"12px", padding: '4px 10px', display:"flex", alignItems:"center", gap: 6, fontSize: 12, fontWeight: 700, color: '#059669'}}>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      ENROLLED
                    </span>
                  )}
                </div>
                <div className="course-card-body">
                  <h3 className="course-card-title" style={{ fontSize: 20, marginBottom: 12 }}>{c.title}</h3>
                  <p className="course-card-desc" style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                    {c.description
                      ? `${c.description.substring(0, 110)}${c.description.length > 110 ? "..." : ""}`
                      : "Practical digital literacy content designed for guided self-paced learning."}
                  </p>
                  <div className="course-card-meta" style={{ display: 'flex', gap: 12 }}>
                    <span className="badge" style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>{c.level}</span>
                    <span className="badge" style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>{c.totalLessons} lessons</span>
                  </div>
                </div>
                <div className="course-card-footer" style={{ borderTop: '1px solid #f1f5f9', padding: '20px 24px', display:'flex', gap:10, alignItems: 'center' }}>
                  <Link to={`/course/${c._id}`} className="btn btn-secondary" style={{ flex: 1, height: 42 }}>View Details</Link>
                  {isEnrolled ? (
                    <button className="btn btn-disabled" style={{ flex: 1, height: 42, background: '#f1f5f9', color: '#94a3b8' }} disabled>Joined</button>
                  ) : (
                    <button className="btn btn-primary" style={{ flex: 1, height: 42 }} onClick={() => handleEnroll(c._id)}>Enroll Now</button>
                  )}
                  <button 
                    className={`btn-save ${isSaved ? "is-saved" : ""}`} 
                    onClick={() => handleSave(c._id)}
                    style={{background:saved.includes(c._id) ? "#b2ff9475" : "white", border:"1px solid #E2E8F0", borderRadius:"10px", width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.2s"}}
                    aria-label={saved.includes(c._id) ? "Unsave course" : "Save course"}
                  >
                    <svg width="18" height="18" fill={saved.includes(c._id) ? "#2563EB" : "none"} viewBox="0 0 24 24" stroke={saved.includes(c._id) ? "#2563EB" : "#94A3B8"} strokeWidth="70"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
       )
      }
    </div>
  );
}
