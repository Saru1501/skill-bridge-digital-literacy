import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyEnrollments, getCourseProgress } from "../../services/api";

const FILTERS = ["all","not_started","in_progress","completed"];

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [progresses,  setProgresses]  = useState({});
  const [filter,      setFilter]      = useState("all");
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyEnrollments();
        const list = res.data.data || [];
        setEnrollments(list);
        const prog = {};
        await Promise.all(list.map(async e => {
          try { const r = await getCourseProgress(e.course._id); prog[e.course._id] = r.data.data; } catch {}
        }));
        setProgresses(prog);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = filter==="all" ? enrollments : enrollments.filter(e => e.completionStatus===filter);

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 className="section-title">My Courses</h1>
          <p className="section-sub">{enrollments.length} enrolled courses</p>
        </div>
        <Link to="/browse" className="btn btn-primary">Browse More</Link>
      </div>

      <div className="tab-bar">
        {FILTERS.map(f => (
          <button key={f} className={"tab-btn"+(filter===f?" active":"")} onClick={()=>setFilter(f)}>
            {f==="all"?"All":f.replace("_"," ").replace(/\b\w/g,c=>c.toUpperCase())}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-icon"><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg></div>
          <h3>No courses here</h3><p>Enroll in courses to see them here.</p>
          <Link to="/browse" className="btn btn-primary">Browse Courses</Link>
        </div></div>
      ) : (
        <div className="enrolled-list">
          {filtered.map(e => {
            const c = e.course; const p = progresses[c._id]; const pct = p?.completionPercentage ?? 0;
            const statusColor = e.completionStatus==="completed"?"badge-green":e.completionStatus==="in_progress"?"badge-yellow":"badge-gray";
            return (
              <div className="enrolled-item" key={e._id}>
                <div className="enrolled-icon">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                </div>
                <div className="enrolled-info">
                  <div className="enrolled-title">{c.title}</div>
                  <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                    <span className="badge badge-blue">{c.category}</span>
                    <span className="badge badge-gray">{c.level}</span>
                  </div>
                  <div className="progress-wrap" style={{maxWidth:360}}>
                    <div className="progress-bar" style={{width:pct+"%"}}></div>
                  </div>
                  <p style={{fontSize:12,color:"#94A3B8",marginTop:4}}>{pct}% â€” {p?.completedLessons?.length ?? 0}/{c.totalLessons} lessons</p>
                </div>
                <div className="enrolled-right">
                  <span className={"badge "+statusColor}>{e.completionStatus.replace("_"," ")}</span>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"flex-end"}}>
                    <Link to={`/course/${c._id}`} className="btn btn-primary btn-sm">Open Course</Link>
                    <Link to={`/assessment/course/${c._id}/missions`} className="btn btn-secondary btn-sm">Assessments</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
