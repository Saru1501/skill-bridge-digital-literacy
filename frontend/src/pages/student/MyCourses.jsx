import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyEnrollments, getCourseProgress } from "../../services/api";
import { unenrollCourse } from "../../services/unenroll";

const FILTERS = ["all","not_started","in_progress","completed"];

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [progresses,  setProgresses]  = useState({});
  const [filter,      setFilter]      = useState("all");
  const [loading,     setLoading]     = useState(true);

  // Reload logic for unenroll
  const loadEnrollments = async () => {
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
  useEffect(() => { loadEnrollments(); }, []);

  const handleUnenroll = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to unenroll from "${courseTitle}"? This action cannot be undone.`)) return;
    try {
      await unenrollCourse(courseId);
      await loadEnrollments();
    } catch (err) {
      alert(err?.response?.data?.message || "Unenrollment failed");
    }
  };

  const filtered = filter==="all" ? enrollments : enrollments.filter(e => e.completionStatus===filter);

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 32 }}>
      <div style={{ background: '#1E293B', borderRadius: 18, padding: 24, marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontWeight: 700, fontSize: 28 }}>My Courses</h1>
      </div>

      <div className="tab-bar">
        {FILTERS.map(f => (
          <button key={f} className={"tab-btn"+(filter===f?" active":"")} onClick={()=>setFilter(f)}>
            {f==="all"?"All Courses":f.replace("_"," ").replace(/\b\w/g,c=>c.toUpperCase())}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card"><div className="empty-state" style={{padding:"80px 40px"}}>
          <div className="empty-state-icon"><svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg></div>
          <h3>Nothing to show here</h3><p>You don't have any courses in this category. Start your journey today!</p>
          <Link to="/browse" className="btn btn-primary" style={{marginTop:20}}>Browse Catalog</Link>
        </div></div>
      ) : (
        <div className="enrolled-list" style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit, minmax(420px, 1fr))',
          gap:32,
          padding:'8px 0 24px 0',
        }}>
          {filtered.map(e => {
            const c = e.course;
            const p = progresses[c._id];
            const pct = p?.completionPercentage ?? 0;
            const statusColor = e.completionStatus === "completed" ? "badge-green" : e.completionStatus === "in_progress" ? "badge-yellow" : "badge-gray";
            return (
              <div key={e._id} style={{
                display: 'flex',
                background: '#fff',
                borderRadius: 24,
                boxShadow: '0 4px 24px 0 rgba(30,41,59,0.08)',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                minHeight: 170,
                position: 'relative',
                alignItems: 'stretch',
                padding: '0 0 0 0',
                margin: 0,
              }}>
                {/* Accent bar */}
                <div style={{width:7,background: pct===100?'#ffffff':'#ffffff',borderRadius:'0 8px 8px 0',margingtop:20, marginRight:20,marginLeft:0}}></div>
                {/* Icon */}
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'center',minWidth:54,paddingTop:32}}>
                  <div style={{background:'#eff6ff',borderRadius:16,padding:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                </div>
                {/* Info */}
                <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'flex-start',padding:'28px 0 24px 0',minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:20,marginBottom:8,color:'#1e293b',lineHeight:1.18}}>{c.title}</div>
                  <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
                    <span className="badge badge-blue">{c.category}</span>
                    <span className={"badge "+statusColor}>{e.completionStatus.replace("_"," ").toUpperCase()}</span>
                  </div>
                  <div style={{height:7,background:'#f1f5f9',borderRadius:6,overflow:'hidden',maxWidth:240,marginBottom:10}}>
                    <div style={{height:'100%',width:`${pct}%`,background:pct===100?'#22c55e':'#2563eb',transition:'width 0.4s',borderRadius:6}}></div>
                  </div>
                  <div style={{fontSize:13,fontWeight:600,color:'#64748B',marginTop:2}}>
                    {pct}% Complete &bull; {p?.completedLessons?.length ?? 0}/{c.totalLessons} Lessons
                  </div>
                </div>
                {/* Actions */}
                <div style={{
                  display:'flex',
                  flexDirection:'column',
                  justifyContent:'flex-start',
                  alignItems:'flex-end',
                  gap:10,
                  padding:'28px 32px 24px 0',
                  minWidth:170,
                  height:'100%',
                }}>
                  <Link to={`/course/${c._id}`} className="btn btn-primary" style={{width:132,justifyContent:'center',marginBottom:6}}>Continue</Link>
                  <Link to={`/assessment/course/${c._id}/missions`} className="btn btn-secondary" style={{width:132,justifyContent:'center',marginBottom:6}}>Assessments</Link>
                  <button className="btn btn-danger" style={{width:132,justifyContent:'center'}} onClick={() => handleUnenroll(c._id, c.title)}>Unenroll</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
