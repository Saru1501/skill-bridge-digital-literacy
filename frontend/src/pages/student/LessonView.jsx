import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLessonById, getLessons, markLessonComplete, trackDownload } from "../../services/api";

export default function LessonView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson,   setLesson]   = useState(null);
  const [siblings, setSiblings] = useState([]);
  const [completed,setCompleted]= useState(false);
  const [loading,  setLoading]  = useState(true);
  const [alert,    setAlert]    = useState({ msg:"", type:"" });
  const flash = (msg,type="success") => { setAlert({msg,type}); setTimeout(()=>setAlert({msg:"",type:""}),3000); };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getLessonById(id);
        const l = res.data.data; setLesson(l);
        const sRes = await getLessons(l.course._id || l.course);
        setSiblings(sRes.data.data || []);
      } catch { flash("Failed to load lesson","error"); } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleComplete = async () => {
    try {
      await markLessonComplete(lesson.course._id || lesson.course, lesson._id);
      setCompleted(true); flash("Lesson marked as complete!");
    } catch (err) { flash(err?.response?.data?.message || "Error","error"); }
  };

  const handleDownload = async (resource) => {
    try { await trackDownload(lesson.course._id || lesson.course, resource.url); } catch {}
    window.open(resource.url, "_blank");
  };

  const curIdx = siblings.findIndex(s => s._id === id);
  const prev   = siblings[curIdx - 1];
  const next   = siblings[curIdx + 1];

  const typeIcon = (type) => {
    if (type==="pdf")   return <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>;
    if (type==="video") return <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>;
    return <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>;
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;
  if (!lesson) return <div className="alert alert-error">Lesson not found.</div>;

  return (
    <div>
      <div style={{marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          Back to Course
        </button>
      </div>

      {alert.msg && <div className={"alert alert-" + alert.type}>{alert.msg}</div>}

      <div className="lesson-layout">
        <div className="lesson-sidebar-panel">
          <div className="lesson-panel-header"><p className="lesson-panel-title">Course Lessons</p></div>
          <div className="lesson-list">
            {siblings.map((s, i) => (
              <div key={s._id} className={"lesson-item" + (s._id===id?" active":"")} style={s._id===id?{background:"#EFF6FF"}:{}} onClick={() => navigate(`/lesson/${s._id}`)}>
                <div className={"lesson-num" + (s._id===id?"":"")} style={s._id===id?{background:"#2563EB",color:"#fff"}:{}}>{i+1}</div>
                <div className="lesson-info"><div className="lesson-title" style={{fontSize:13}}>{s.title}</div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="lesson-main-panel">
          <div style={{padding:"20px 28px",borderBottom:"1px solid #E2E8F0"}}>
            <h1 style={{fontSize:22,fontWeight:800,marginBottom:6}}>{lesson.title}</h1>
            {lesson.description && <p style={{color:"#64748B",fontSize:14}}>{lesson.description}</p>}
            {lesson.duration > 0 && <span className="badge badge-gray" style={{marginTop:8,display:"inline-block"}}>{lesson.duration} minutes</span>}
          </div>

          <div className="lesson-content-area">
            {lesson.content ? (
              <div className="lesson-content-text">{lesson.content}</div>
            ) : (
              <div style={{color:"#94A3B8",fontSize:14,textAlign:"center",padding:40}}>No content available for this lesson.</div>
            )}

            {lesson.resources?.length > 0 && (
              <div style={{marginTop:32}}>
                <h3 style={{fontSize:15,fontWeight:700,marginBottom:16}}>Lesson Resources ({lesson.resources.length})</h3>
                <div className="resource-list">
                  {lesson.resources.map((r, i) => (
                    <div className="resource-item" key={i}>
                      <div className="resource-item-left">
                        <div className={"resource-type-icon " + (r.type || "other")}>{typeIcon(r.type)}</div>
                        <div><div className="resource-name">{r.name}</div><div className="resource-type">{r.type || "file"}</div></div>
                      </div>
                      {r.isDownloadable && (
                        <button className="btn btn-secondary btn-sm" onClick={() => handleDownload(r)}>
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                          Download
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{padding:"16px 28px",borderTop:"1px solid #E2E8F0",display:"flex",alignItems:"center",gap:10,justifyContent:"space-between"}}>
            <div style={{display:"flex",gap:8}}>
              {prev && <button className="btn btn-secondary" onClick={() => navigate(`/lesson/${prev._id}`)}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                Previous
              </button>}
              {next && <button className="btn btn-secondary" onClick={() => navigate(`/lesson/${next._id}`)}>
                Next
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>}
            </div>
            <div>
              {completed ? (
                <span className="badge badge-green" style={{padding:"8px 16px",fontSize:13}}>Completed</span>
              ) : (
                <button className="btn btn-success" onClick={handleComplete}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Mark as Complete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
