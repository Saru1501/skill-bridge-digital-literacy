import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getCourses, enrollCourse, toggleSave, getMySaved } from "../../services/api";

const CATEGORIES = ["","Basic IT","Internet Safety","Online Jobs","Digital Payments","Digital Tools"];
const LEVELS     = ["","beginner","intermediate","advanced"];

export default function BrowseCourses() {
  const [courses,  setCourses]  = useState([]);
  const [saved,    setSaved]    = useState([]);
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
      const [cRes, sRes] = await Promise.all([getCourses(params), getMySaved()]);
      setCourses(cRes.data.data || []);
      setSaved((sRes.data.data || []).map(s => s.course._id));
    } catch { setCourses([]); } finally { setLoading(false); }
  }, [search, category, level]);

  useEffect(() => { load(); }, [load]);

  const handleEnroll = async (courseId) => {
    try { await enrollCourse(courseId); flash("Enrolled successfully! Check My Courses."); }
    catch (err) { flash(err?.response?.data?.message || "Enrollment failed", "error"); }
  };

  const handleSave = async (courseId) => {
    try {
      const res = await toggleSave(courseId);
      if (res.data.isSaved) setSaved(s => [...s, courseId]);
      else setSaved(s => s.filter(id => id !== courseId));
    } catch {}
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">Browse Courses</h1>
          <p className="section-sub">{courses.length} courses available</p>
        </div>
      </div>

      {alert.msg && <div className={"alert alert-" + alert.type}>{alert.msg}</div>}

      <div className="filters-bar">
        <div className="search-box">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input className="form-control" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} style={{paddingLeft:38}} />
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
          <div className="empty-state-icon"><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></div>
          <h3>No courses found</h3><p>Try adjusting your search or filters.</p>
        </div></div>
       ) : (
        <div className="courses-grid">
          {courses.map(c => (
            <div className="course-card" key={c._id}>
              <div className="course-card-header">
                <span className="course-card-cat">{c.category}</span>
              </div>
              <div className="course-card-body">
                <h3 className="course-card-title">{c.title}</h3>
                <p className="course-card-desc">{c.description?.substring(0,100)}{c.description?.length > 100 ? "..." : ""}</p>
                <div className="course-card-meta">
                  <span className="badge badge-blue">{c.level}</span>
                  <span className="badge badge-gray">{c.totalLessons} lessons</span>
                  <span className="badge badge-gray">{c.enrollmentCount} enrolled</span>
                </div>
              </div>
              <div className="course-card-footer">
                <Link to={`/course/${c._id}`} className="btn btn-secondary btn-sm" style={{flex:1,justifyContent:"center"}}>View Details</Link>
                <button className="btn btn-primary btn-sm" style={{flex:1,justifyContent:"center"}} onClick={() => handleEnroll(c._id)}>Enroll</button>
                <button className="btn btn-secondary btn-sm" style={{padding:"5px 8px"}} onClick={() => handleSave(c._id)} title={saved.includes(c._id) ? "Unsave" : "Save"}>
                  {saved.includes(c._id) ? (
                    <svg width="16" height="16" fill="#2563EB" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
       )
      }
    </div>
  );
}
