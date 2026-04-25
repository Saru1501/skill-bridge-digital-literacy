import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCourseById, getLessons, checkEnrollment, enrollCourse, getCourseProgress, toggleSave, getMySaved } from "../../services/api";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ msg:"", type:"" });
  const [saved, setSaved] = useState(false);

  const flash = (msg, type="success") => { setAlert({msg,type}); setTimeout(()=>setAlert({msg:"",type:""}),3500); };

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, lRes, eRes, sRes] = await Promise.all([
          getCourseById(id),
          getLessons(id),
          checkEnrollment(id),
          getMySaved()
        ]);
        setCourse(cRes.data.data); 
        setLessons(lRes.data.data || []); 
        setEnrolled(eRes.data.isEnrolled);
        if (eRes.data.isEnrolled) { try { const pRes = await getCourseProgress(id); setProgress(pRes.data.data); } catch {} }
        setSaved((sRes.data.data || []).some(item => item.course._id === id));
      } catch { flash("Failed to load course details", "error"); } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleEnroll = async () => {
    try { await enrollCourse(id); setEnrolled(true); flash("Enrolled successfully! Enjoy your learning."); }
    catch (err) { flash(err?.response?.data?.message || "Enrollment failed", "error"); }
  };

  const handleToggleSave = async () => {
    try {
      await toggleSave(id);
      setSaved(s => !s);
      flash(saved ? "Removed from saved library" : "Course saved to your library");
    } catch {
      flash("Failed to update saved state", "error");
    }
  };

  const isCompleted = (lessonId) => progress?.completedLessons?.some(l => (l._id||l) === lessonId);
  const pct = progress?.completionPercentage ?? 0;

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;
  if (!course) return <div className="alert alert-error">Course not found.</div>;

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 32 }}>
      <div style={{ background: '#1E293B', borderRadius: 18, padding: 24, marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontWeight: 700, fontSize: 28 }}>Course Details</h1>
      </div>

      <div style={{marginBottom:24, display:"flex", alignItems:"center", gap:12}}>
        <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{padding: "8px 16px"}}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          Back
        </button>
        <span style={{color: "#94A3B8", fontSize: 13}}>Courses / {course.category} / {course.title}</span>
      </div>

      {alert.msg && <div className={"alert alert-" + alert.type}>{alert.msg}</div>}

      <div className="detail-hero">
        <div style={{flex:1, position:"relative", zIndex:2}}>
          <div className="hero-meta">
            <span className="hero-tag">{course.category}</span>
            <span className="hero-tag">{course.level}</span>
          </div>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div style={{display:"flex", gap:24, marginTop:32, flexWrap:"wrap"}}>
             <div style={{display:"flex", alignItems:"center", gap:10}}>
                <div style={{width:40, height:40, borderRadius:"50%", background:"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center"}}>ðŸ“–</div>
                <div><div style={{fontSize:15, fontWeight:700}}>{course.totalLessons} Lessons</div><div style={{fontSize:12, color:"rgba(255,255,255,0.6)"}}>Expert Content</div></div>
             </div>
             <div style={{display:"flex", alignItems:"center", gap:10}}>
                <div style={{width:40, height:40, borderRadius:"50%", background:"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center"}}>ðŸ‘¥</div>
                <div><div style={{fontSize:15, fontWeight:700}}>{course.enrollmentCount} Students</div><div style={{fontSize:12, color:"rgba(255,255,255,0.6)"}}>Learning Community</div></div>
             </div>
          </div>
        </div>
        <div style={{width: 240, display:"flex", flexDirection:"column", gap:12, position:"relative", zIndex:2}}>
           <button 
             className="btn" 
             style={{background: saved ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)", color:"white", border:"1px solid rgba(255,255,255,0.2)", backdropFilter:"blur(8px)", justifyContent:"center"}}
             onClick={handleToggleSave}
           >
             {saved ? "Saved in Library" : "Save to Library"}
           </button>
           {!enrolled && (
             <button className="btn" style={{background:"white", color:"var(--primary)", justifyContent:"center", boxShadow:"0 4px 14px rgba(0,0,0,0.2)"}} onClick={handleEnroll}>
               Enroll for Free
             </button>
           )}
        </div>
        {/* Background Graphic */}
        <div style={{position:"absolute", right:"-5%", bottom:"-20%", width:"50%", height:"120%", background:"radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)", borderRadius:"50%", zIndex:1}}></div>
      </div>

      <div style={{display:"grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems:"start"}}>
        <div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Curriculum Structure</h3>
              <span className="badge badge-gray">{lessons.length} Modules</span>
            </div>
            <div className="card-body" style={{padding: "24px 32px 32px"}}>
              <div className="lesson-list">
                {lessons.length === 0 ? (
                  <div style={{padding:40, textAlign:"center", color:"#94A3B8"}}>
                    <div style={{fontSize:32, marginBottom:12}}>ðŸ“ </div>
                    <p>Modules are being prepared by our academic team.</p>
                  </div>
                ) : lessons.map((l, i) => (
                  <div className="lesson-item" key={l._id} onClick={() => enrolled && navigate(`/lesson/${l._id}`)}>
                    <div className={"lesson-num" + (isCompleted(l._id) ? " done" : "")}>
                       {isCompleted(l._id) ? "âœ“" : (i + 1).toString().padStart(2, '0')}
                    </div>
                    <div className="lesson-info">
                      <div className="lesson-title">{l.title}</div>
                      <div className="lesson-meta">{l.tags?.join(", ") || "Main Module"} &bull; {l.duration || "15"} mins</div>
                    </div>
                    <div className="lesson-right" style={{display:"flex", alignItems:"center", gap:12}}>
                      {l.resources?.length > 0 && <span className="badge badge-gray" style={{background:"#fff"}}>{l.resources.length} files</span>}
                      {enrolled ? (
                         <div style={{width:32, height:32, borderRadius:"50%", background:"#EFF6FF", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--primary)"}}>â–¶ï¸ </div>
                      ) : (
                         <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#CBD5E1" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{display:"flex", flexDirection:"column", gap:24}}>
          {enrolled && (
            <div className="card" style={{background: "#F0F9FF", borderColor: "#BAE6FD"}}>
              <div className="card-body">
                <h3 style={{fontSize:16, fontWeight:800, marginBottom:16, color: "#0369A1"}}>Learning Progress</h3>
                <div style={{marginBottom:16}}>
                   <div style={{display:"flex", justifyContent:"space-between", marginBottom:8}}>
                      <span style={{fontSize:13, fontWeight:700, color:"#0C4A6E"}}>{pct}% Complete</span>
                      <span style={{fontSize:11, color:"#0369A1"}}>{progress?.completedLessons?.length || 0}/{course.totalLessons} Lessons</span>
                   </div>
                   <div className="progress-wrap"><div className="progress-bar" style={{width:pct+"%"}}></div></div>
                </div>
                <button className="btn btn-primary" style={{width:"100%", justifyContent:"center"}} onClick={() => lessons[0] && navigate(`/lesson/${lessons[0]._id}`)}>
                   {pct > 0 ? "Continue Journey" : "Begin Learning"}
                </button>
                <Link to={`/assessment/course/${course._id}/missions`} className="btn btn-secondary" style={{width:"100%", justifyContent:"center", marginTop:10}}>
                   Access Assessments
                </Link>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-body">
              <h4 style={{fontSize:14, fontWeight:800, marginBottom:20, textTransform:"uppercase", letterSpacing:"0.05em", color:"#64748B"}}>Course Metadata</h4>
              <div style={{display:"flex", flexDirection:"column", gap:4}}>
                 {[
                   { label: "Difficulty", value: course.level, color: "blue" },
                   { label: "Duration", value: "Self-Paced", color: "gray" },
                   { label: "Certificate", value: "Verified", color: "green" },
                   { label: "Language", value: "English", color: "gray" }
                 ].map(item => (
                   <div key={item.label} style={{display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid #F1F5F9"}}>
                      <span style={{fontSize:13, color:"#64748B", fontWeight:500}}>{item.label}</span>
                      <span className={"badge badge-" + item.color}>{item.value}</span>
                   </div>
                 ))}
              </div>
              
              <div style={{marginTop:24, padding:20, background:"#F8FAFC", borderRadius:12, border:"1px solid #E2E8F0"}}>
                 <h5 style={{fontSize:12, fontWeight:800, color:"#475569", marginBottom:8}}>Targeted Audience</h5>
                 <p style={{fontSize:12, color:"#64748B", lineHeight:1.6}}>Specially designed for rural youth entering the digital workforce.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
