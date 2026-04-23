import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLessonById, getLessons, markLessonComplete, trackDownload, syncOffline } from "../../services/api";

// ── Offline helpers ────────────────────────────────────────────────────────────
const OL_KEY = (courseId) => `sb_offline_${courseId}`;
const getOfflineCache = (courseId) => { try { return JSON.parse(localStorage.getItem(OL_KEY(courseId)) || "{}"); } catch { return {}; } };
const saveOfflineCache = (courseId, data) => localStorage.setItem(OL_KEY(courseId), JSON.stringify(data));
const addOfflineLesson = (courseId, lessonId) => {
  const cache = getOfflineCache(courseId);
  cache.pendingLessons = [...new Set([...(cache.pendingLessons || []), lessonId])];
  saveOfflineCache(courseId, cache);
};

// ── Resource viewer component ──────────────────────────────────────────────────
function ResourceViewer({ resource, onClose }) {
  const isPDF   = resource.type === "pdf"   || resource.url?.toLowerCase().includes(".pdf");
  const isVideo = resource.type === "video" || resource.url?.toLowerCase().match(/\.(mp4|webm|ogg)$/);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:2000,display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px",background:"#0F172A",borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{color:"#94A3B8",fontSize:12,textTransform:"uppercase",letterSpacing:1}}>{resource.type || "File"}</span>
          <span style={{color:"#fff",fontWeight:600,fontSize:15}}>{resource.name}</span>
        </div>
        <div style={{display:"flex",gap:10}}>
          {resource.isDownloadable && (
            <a href={resource.url} download target="_blank" rel="noreferrer"
              style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",background:"#2563EB",color:"#fff",borderRadius:7,fontSize:13,fontWeight:600,textDecoration:"none"}}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Download
            </a>
          )}
          <button onClick={onClose}
            style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",background:"rgba(255,255,255,0.1)",color:"#fff",border:"none",borderRadius:7,fontSize:13,fontWeight:600,cursor:"pointer"}}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            Close
          </button>
        </div>
      </div>
      <div style={{flex:1,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
        {isPDF ? (
          <iframe src={resource.url + "#toolbar=1&navpanes=1"} style={{width:"100%",height:"100%",border:"none",borderRadius:8,background:"#fff"}} title={resource.name} />
        ) : isVideo ? (
          <video controls autoPlay style={{maxWidth:"100%",maxHeight:"100%",borderRadius:8,background:"#000"}}>
            <source src={resource.url} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div style={{textAlign:"center",color:"#fff"}}>
            <div style={{fontSize:48,marginBottom:16}}>
              <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
            </div>
            <p style={{marginBottom:12,color:"#94A3B8"}}>Preview not available for this file type</p>
            <a href={resource.url} target="_blank" rel="noreferrer"
              style={{padding:"10px 20px",background:"#2563EB",color:"#fff",borderRadius:8,textDecoration:"none",fontWeight:600}}>
              Open in New Tab
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main LessonView ────────────────────────────────────────────────────────────
export default function LessonView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson,     setLesson]     = useState(null);
  const [siblings,   setSiblings]   = useState([]);
  const [completed,  setCompleted]  = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [alert,      setAlert]      = useState({ msg:"", type:"" });
  const [viewer,     setViewer]     = useState(null);
  const [isOnline,   setIsOnline]   = useState(navigator.onLine);
  const [syncing,    setSyncing]    = useState(false);

  const flash = (msg, type="success") => { setAlert({msg,type}); setTimeout(()=>setAlert({msg:"",type:""}),3500); };

  // Online/offline detection
  useEffect(() => {
    const onOnline  = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online",  onOnline);
    window.addEventListener("offline", onOffline);
    return () => { window.removeEventListener("online",onOnline); window.removeEventListener("offline",onOffline); };
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res  = await getLessonById(id);
        const l    = res.data.data;
        setLesson(l);
        const sRes = await getLessons(l.course._id || l.course);
        setSiblings(sRes.data.data || []);
      } catch { flash("Failed to load lesson","error"); } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleComplete = async () => {
    const courseId = lesson.course._id || lesson.course;
    if (isOnline) {
      try {
        const res = await markLessonComplete(courseId, lesson._id);
        setCompleted(true);
        flash(res.data.courseCompleted ? "Course completed! Well done!" : "Lesson marked as complete!");
      } catch (err) { flash(err?.response?.data?.message || "Error marking complete","error"); }
    } else {
      // Offline: cache locally
      addOfflineLesson(courseId, lesson._id);
      setCompleted(true);
      flash("Saved offline. Progress will sync when you reconnect.");
    }
  };

  const handleSyncOffline = async () => {
    const courseId = lesson.course._id || lesson.course;
    const cache    = getOfflineCache(courseId);
    const pending  = cache.pendingLessons || [];
    if (!pending.length) { flash("No offline progress to sync.","warning"); return; }
    setSyncing(true);
    try {
      await syncOffline(courseId, pending);
      saveOfflineCache(courseId, { ...cache, pendingLessons: [] });
      flash(`Synced ${pending.length} lesson(s) to server!`);
    } catch { flash("Sync failed. Will retry when online.","error"); } finally { setSyncing(false); }
  };

  const handleDownload = async (resource) => {
    const courseId = lesson.course._id || lesson.course;
    try { await trackDownload(courseId, resource.url); } catch {}
    window.open(resource.url, "_blank");
  };

  const curIdx = siblings.findIndex(s => s._id === id);
  const prev   = siblings[curIdx - 1];
  const next   = siblings[curIdx + 1];
  const courseId = lesson?.course?._id || lesson?.course;
  const offlineCache = courseId ? getOfflineCache(courseId) : {};
  const pendingSync  = (offlineCache.pendingLessons || []).length;

  const typeIcon = (type) => {
    if (type==="pdf")    return <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>;
    if (type==="video")  return <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>;
    if (type==="slides") return <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>;
    return <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>;
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;
  if (!lesson) return <div className="alert alert-error">Lesson not found.</div>;

  return (
    <div>
      {viewer && <ResourceViewer resource={viewer} onClose={() => setViewer(null)} />}

      <div style={{marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          Back to Course
        </button>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{display:"flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600,color:isOnline?"#16A34A":"#D97706"}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:isOnline?"#16A34A":"#D97706",display:"inline-block"}}></span>
            {isOnline ? "Online" : "Offline"}
          </span>
          {pendingSync > 0 && isOnline && (
            <button className="btn btn-warning btn-sm" onClick={handleSyncOffline} disabled={syncing}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              {syncing ? "Syncing..." : `Sync ${pendingSync} lesson${pendingSync>1?"s":""}`}
            </button>
          )}
        </div>
      </div>

      {alert.msg && <div className={"alert alert-"+alert.type}>{alert.msg}</div>}

      <div className="lesson-layout">
        {/* Lesson sidebar list */}
        <div className="lesson-sidebar-panel">
          <div className="lesson-panel-header">
            <p className="lesson-panel-title">Course Lessons</p>
            <span style={{fontSize:11,color:"#94A3B8"}}>{siblings.length} total</span>
          </div>
          <div className="lesson-list">
            {siblings.map((s, i) => (
              <div key={s._id}
                className={"lesson-item" + (s._id===id ? " active" : "")}
                style={s._id===id ? {background:"#EFF6FF"} : {}}
                onClick={() => navigate(`/lesson/${s._id}`)}>
                <div className="lesson-num" style={s._id===id ? {background:"#2563EB",color:"#fff"} : {}}>{i+1}</div>
                <div className="lesson-info">
                  <div className="lesson-title" style={{fontSize:13,lineHeight:1.4}}>{s.title}</div>
                  {s.duration > 0 && <div style={{fontSize:11,color:"#94A3B8",marginTop:2}}>{s.duration} min</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main lesson content */}
        <div className="lesson-main-panel">
          <div style={{padding:"20px 28px",borderBottom:"1px solid #E2E8F0"}}>
            <h1 style={{fontSize:22,fontWeight:800,marginBottom:6,lineHeight:1.3}}>{lesson.title}</h1>
            {lesson.description && <p style={{color:"#64748B",fontSize:14,lineHeight:1.6}}>{lesson.description}</p>}
            <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
              {lesson.duration > 0 && <span className="badge badge-gray">{lesson.duration} minutes</span>}
              {lesson.resources?.length > 0 && <span className="badge badge-blue">{lesson.resources.length} resource{lesson.resources.length>1?"s":""}</span>}
            </div>
          </div>

          <div className="lesson-content-area">
            {lesson.content ? (
              <div className="lesson-content-text">{lesson.content}</div>
            ) : (
              <div style={{color:"#94A3B8",fontSize:14,textAlign:"center",padding:40,background:"#F8FAFC",borderRadius:8}}>
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1" style={{color:"#CBD5E1",margin:"0 auto 12px",display:"block"}}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                No written content for this lesson. See resources below.
              </div>
            )}

            {lesson.resources?.length > 0 && (
              <div style={{marginTop:32}}>
                <h3 style={{fontSize:15,fontWeight:700,marginBottom:16,color:"#1E293B"}}>
                  Lesson Resources ({lesson.resources.length})
                </h3>
                <div className="resource-list">
                  {lesson.resources.map((r, i) => (
                    <div className="resource-item" key={i}>
                      <div className="resource-item-left">
                        <div className={"resource-type-icon " + (r.type || "other")}>{typeIcon(r.type)}</div>
                        <div>
                          <div className="resource-name">{r.name}</div>
                          <div className="resource-type">{r.type || "file"}</div>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setViewer(r)}>
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                          Preview
                        </button>
                        {r.isDownloadable && (
                          <button className="btn btn-primary btn-sm" onClick={() => handleDownload(r)}>
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation footer */}
          <div style={{padding:"16px 28px",borderTop:"1px solid #E2E8F0",display:"flex",alignItems:"center",gap:10,justifyContent:"space-between",background:"#F8FAFC"}}>
            <div style={{display:"flex",gap:8}}>
              {prev && (
                <button className="btn btn-secondary" onClick={() => navigate(`/lesson/${prev._id}`)}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                  Previous
                </button>
              )}
              {next && (
                <button className="btn btn-secondary" onClick={() => navigate(`/lesson/${next._id}`)}>
                  Next
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              )}
            </div>
            <div>
              {completed ? (
                <span className="badge badge-green" style={{padding:"9px 18px",fontSize:13}}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{display:"inline",marginRight:5}}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Lesson Complete
                </span>
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
