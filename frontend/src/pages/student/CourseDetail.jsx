import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCourseById, getLessons, checkEnrollment, enrollCourse, getCourseProgress, toggleSave } from "../../services/api";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course,   setCourse]   = useState(null);
  const [lessons,  setLessons]  = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [progress, setProgress] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [alert,    setAlert]    = useState({ msg:"", type:"" });

  const flash = (msg, type="success") => { setAlert({msg,type}); setTimeout(()=>setAlert({msg:"",type:""}),3500); };

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, lRes, eRes] = await Promise.all([getCourseById(id), getLessons(id), checkEnrollment(id)]);
        setCourse(cRes.data.data); setLessons(lRes.data.data || []); setEnrolled(eRes.data.isEnrolled);
        if (eRes.data.isEnrolled) { try { const pRes = await getCourseProgress(id); setProgress(pRes.data.data); } catch {} }
      } catch { flash("Failed to load course", "error"); } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleEnroll = async () => {
    try { await enrollCourse(id); setEnrolled(true); flash("Enrolled successfully! Start learning now."); }
    catch (err) { flash(err?.response?.data?.message || "Enrollment failed", "error"); }
  };

  const isCompleted = (lessonId) => progress?.completedLessons?.some(l => (l._id||l) === lessonId);
  const pct = progress?.completionPercentage ?? 0;

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;
  if (!course) return <div className="alert alert-error">Course not found.</div>;

  return (
    <div>
      <div style={{marginBottom:20}}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          Back
        </button>
      </div>

      {alert.msg && <div className={"alert alert-" + alert.type}>{alert.msg}</div>}

      <div className="detail-hero">
        <div className="detail-hero-meta">
          <span className="hero-tag">{course.category}</span>
          <span className="hero-tag">{course.level}</span>
          <span className="hero-tag">{course.totalLessons} Lessons</span>
          <span className="hero-tag">{course.enrollmentCount} Enrolled</span>
        </div>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        {course.tags?.length > 0 && (
          <div style={{display:"flex",gap:8,marginTop:16,flexWrap:"wrap"}}>
            {course.tags.map(t => <span key={t} style={{background:"rgba(255,255,255,0.1)",color:"#fff",padding:"2px 10px",borderRadius:20,fontSize:12}}>{t}</span>)}
          </div>
        )}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:24,alignItems:"start"}}>
        <div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Course Lessons ({lessons.length})</h3>
            </div>
            <div className="lesson-list">
              {lessons.length === 0 ? (
                <div style={{padding:24,textAlign:"center",color:"#94A3B8"}}>No lessons added yet.</div>
              ) : lessons.map((l, i) => (
                <div className="lesson-item" key={l._id} onClick={() => enrolled && navigate(`/lesson/${l._id}`)}>
                  <div className={"lesson-num" + (isCompleted(l._id) ? " done" : "")}>{isCompleted(l._id) ? "âœ“" : i+1}</div>
                  <div className="lesson-info">
                    <div className="lesson-title">{l.title}</div>
                    <div className="lesson-meta">{l.description || "â€”"}{l.duration ? ` â€¢ ${l.duration} min` : ""}</div>
                  </div>
                  <div className="lesson-right">
                    {l.resources?.length > 0 && <span className="badge badge-gray">{l.resources.length} files</span>}
                    {enrolled ? <span className="badge badge-blue">Open</span> : <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#94A3B8" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div className="card">
            <div className="card-body">
              {enrolled ? (
                <>
                  <div style={{marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontSize:13,fontWeight:600}}>Your Progress</span>
                      <span style={{fontSize:13,fontWeight:700,color:"#2563EB"}}>{pct}%</span>
                    </div>
                    <div className="progress-wrap"><div className="progress-bar" style={{width:pct+"%"}}></div></div>
                    <p style={{fontSize:12,color:"#94A3B8",marginTop:6}}>{progress?.completedLessons?.length ?? 0} of {course.totalLessons} lessons completed</p>
                  </div>
                  <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={() => lessons[0] && navigate(`/lesson/${lessons[0]._id}`)}>
                    {pct > 0 ? "Continue Learning" : "Start Course"}
                  </button>
                  <Link to={`/assessment/course/${course._id}/missions`} className="btn btn-secondary" style={{width:"100%",justifyContent:"center",marginTop:10}}>
                    Open Assessments
                  </Link>
                </>
              ) : (
                <>
                  <h3 style={{fontSize:16,fontWeight:700,marginBottom:8}}>Enroll for Free</h3>
                  <p style={{fontSize:13,color:"#64748B",marginBottom:16}}>Get access to all {course.totalLessons} lessons and downloadable resources.</p>
                  <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={handleEnroll}>Enroll Now</button>
                </>
              )}
            </div>
          </div>
          <div className="card"><div className="card-body">
            <h4 style={{fontSize:14,fontWeight:600,marginBottom:12}}>Course Info</h4>
            {[["Category",course.category],["Level",course.level],["Lessons",course.totalLessons],["Students",course.enrollmentCount]].map(([k,v]) => (
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #F1F5F9",fontSize:13}}>
                <span style={{color:"#64748B"}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
              </div>
            ))}
          </div></div>
        </div>
      </div>
    </div>
  );
}
