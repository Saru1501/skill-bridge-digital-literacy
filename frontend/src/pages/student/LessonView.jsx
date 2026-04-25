import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  downloadResource,
  getLessonById,
  getLessons,
  getMySavedResources,
  markLessonComplete,
  syncOffline,
  toggleSaveResource,
  trackDownload,
} from "../../services/api";

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
function ResourceViewer({ resource, onClose, lessonId }) {
  const isPDF   = resource.type === "pdf"   || resource.url?.toLowerCase().includes(".pdf");
  const isVideo = resource.type === "video" || resource.url?.toLowerCase().match(/\.(mp4|webm|ogg)$/);
  const isImage = resource.type === "image" || resource.url?.toLowerCase().match(/\.(png|jpg|jpeg|gif|webp)$/);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
  const proxyUrl = `${API_BASE_URL}/lessons/${lessonId}/resources/${resource._id}/download`;
  const viewUrl = isPDF ? proxyUrl : resource.url;

  // Download URL logic: always use backend proxy for all types
  const downloadUrl = `${proxyUrl}?download=true`;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.98)",zIndex:2000,display:"flex",flexDirection:"column",backdropFilter:"blur(12px)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 28px",background:"rgba(255,255,255,0.05)",borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{background:"var(--primary)",width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"}}>
             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <div>
            <div style={{color:"#fff",fontWeight:800,fontSize:16}}>{resource.name}</div>
            <div style={{color:"rgba(255,255,255,0.5)",fontSize:11,textTransform:"uppercase",fontWeight:700,letterSpacing:"0.05em"}}>{resource.type || "Learning Material"}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:12}}>
          {resource.isDownloadable && (
            <a href={downloadUrl} download target="_blank" rel="noreferrer" className="btn btn-primary" style={{padding:"8px 16px"}}>
               <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
               Download
            </a>
          )}
          <button onClick={onClose} className="btn" style={{background:"rgba(255,255,255,0.1)",color:"#fff",padding:"8px 16px"}}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            Close Viewer
          </button>
        </div>
      </div>
      <div style={{flex:1,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",padding:40}}>
        {isPDF ? (
          <iframe src={viewUrl + "#toolbar=1&navpanes=1"} style={{width:"100%",height:"100%",border:"none",borderRadius:16,background:"#fff",boxShadow:"0 20px 50px rgba(0,0,0,0.3)"}} title={resource.name} />
        ) : isVideo ? (
          <div style={{width:"100%", height:"100%", maxWidth:1100, display:"flex", alignItems:"center"}}>
             <video controls autoPlay style={{width:"100%", borderRadius:16, background:"#000", boxShadow:"0 20px 50px rgba(0,0,0,0.3)"}}>
               <source src={resource.url} />
               Your browser does not support the video tag.
             </video>
          </div>
        ) : isImage ? (
          <div style={{width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center"}}>
            <img src={resource.url} alt={resource.name} style={{maxWidth:"100%", maxHeight:"80vh", borderRadius:16, boxShadow:"0 20px 50px rgba(0,0,0,0.3)", background:"#fff"}} />
          </div>
        ) : (
          <div style={{textAlign:"center",background:"rgba(255,255,255,0.05)",padding:60,borderRadius:24,border:"1px dashed rgba(255,255,255,0.2)"}}>
            <div style={{fontSize:48,marginBottom:24}}>⚠️</div>
            <h3 style={{color:"#fff",marginBottom:12,fontSize:20}}>Preview Unavailable</h3>
            <p style={{marginBottom:24,color:"rgba(255,255,255,0.6)"}}>This file type cannot be previewed in the browser.</p>
            <a href={resource.url} target="_blank" rel="noreferrer" className="btn btn-primary" style={{padding:"12px 24px"}}>
              Open in New Window
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
  const [savedResources, setSavedResources] = useState([]);

  const flash = (msg, type="success") => { setAlert({msg,type}); setTimeout(()=>setAlert({msg:"",type:""}),3500); };

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
        const [lessonRes, savedRes] = await Promise.all([
          getLessonById(id),
          getMySavedResources().catch(() => ({ data: { data: [] } })),
        ]);
        const l    = lessonRes.data.data;
        setLesson(l);
        setSavedResources((savedRes.data.data || []).map((item) => item.resourceId));
        const sRes = await getLessons(l.course._id || l.course);
        setSiblings(sRes.data.data || []);
      } catch { flash("Failed to load module content","error"); } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleComplete = async () => {
    const courseId = lesson.course._id || lesson.course;
    if (isOnline) {
      try {
        const res = await markLessonComplete(courseId, lesson._id);
        setCompleted(true);
        flash(res.data.courseCompleted ? "Milestone: Course complete! Congratulations!" : "Module marked as finished!");
      } catch (err) { flash(err?.response?.data?.message || "Technical error","error"); }
    } else {
      addOfflineLesson(courseId, lesson._id);
      setCompleted(true);
      flash("Authenticated Offline: Progress will sync automatically.");
    }
  };

  const handleSyncOffline = async () => {
    const courseId = lesson.course._id || lesson.course;
    const cache    = getOfflineCache(courseId);
    const pending  = cache.pendingLessons || [];
    if (!pending.length) return;
    setSyncing(true);
    try {
      await syncOffline(courseId, pending);
      saveOfflineCache(courseId, { ...cache, pendingLessons: [] });
      flash(`Successfully synchronized ${pending.length} modules!`);
    } catch { flash("Synchronization failed. Check connection.","error"); } finally { setSyncing(false); }
  };

  const handleToggleSaveResource = async (resourceId) => {
    try {
      const response = await toggleSaveResource(id, resourceId);
      setSavedResources((current) =>
        response.data.isSaved
          ? [...new Set([...current, resourceId])]
          : current.filter((savedId) => savedId !== resourceId)
      );
      flash(response.data.message || "Resource updated.");
    } catch (err) {
      flash(err?.response?.data?.message || "Unable to update saved resources.", "error");
    }
  };

  const handleResourceDownload = async (resource) => {
    try {
      if (courseId) {
        await trackDownload(courseId, resource.url);
      }

      const res = await downloadResource(id, resource._id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", resource.name || "resource");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
      const proxyUrl = `${API_BASE_URL}/lessons/${id}/resources/${resource._id}/download?download=true`;
      window.open(proxyUrl, "_blank", "noopener,noreferrer");
    }
  };

  const curIdx = siblings.findIndex(s => s._id === id);
  const prev   = siblings[curIdx - 1];
  const next   = siblings[curIdx + 1];
  const courseId = lesson?.course?._id || lesson?.course;
  const offlineCache = courseId ? getOfflineCache(courseId) : {};
  const pendingSync  = (offlineCache.pendingLessons || []).length;

  const typeIcon = (type) => {
    if (type==="pdf")    return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>;
    if (type==="video")  return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>;
    if (type==="slides") return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>;
    return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>;
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;
  if (!lesson) return <div className="alert alert-error">Module not found.</div>;

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 32 }}>
      <div style={{ background: '#1E293B', borderRadius: 18, padding: 24, marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontWeight: 700, fontSize: 28 }}>Lesson</h1>
      </div>

      {viewer && <ResourceViewer resource={viewer} onClose={() => setViewer(null)} lessonId={id} />}

      <div style={{marginBottom:24, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <div style={{display:"flex", alignItems:"center", gap:12}}>
          <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{padding:"8px 16px"}}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Course Portal
          </button>
          <span style={{color:"#94A3B8", fontSize:13}}>{lesson.course?.title} / <span style={{color:"#475569", fontWeight:700}}>{lesson.title}</span></span>
        </div>
        
        <div style={{display:"flex", alignItems:"center", gap:12}}>
          <span style={{display:"inline-flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:20, background:isOnline?"#ECFDF5":"#FFF7ED", color:isOnline?"#10B981":"#D97706", fontSize:12, fontWeight:700}}>
            <span style={{width:8, height:8, borderRadius:"50%", background:isOnline?"#10B981":"#D97706"}}></span>
            {isOnline ? "Network Connected" : "Local Workspace"}
          </span>
          {pendingSync > 0 && isOnline && (
            <button className="btn btn-warning" onClick={handleSyncOffline} disabled={syncing} style={{padding:"6px 14px", fontSize:12}}>
               {syncing ? "Syncing Workspace..." : `Upload ${pendingSync} Pending Modules`}
            </button>
          )}
        </div>
      </div>

      {alert.msg && <div className={"alert alert-"+alert.type} style={{marginBottom:24}}>{alert.msg}</div>}

      <div className="lesson-layout">
        <div className="lesson-sidebar-panel">
          <div className="lesson-panel-header">
            <p className="lesson-panel-title">Your Progress</p>
            <div style={{fontSize:11, color:"var(--primary)", fontWeight:800, marginTop:4}}>Module {curIdx+1 || 1} of {siblings.length}</div>
          </div>
          <div style={{flex:1, overflowY:"auto", padding:12}}>
            <div className="lesson-list">
              {siblings.map((s, i) => {
                const isActive = s._id === id;
                return (
                  <div key={s._id}
                    className={"lesson-item" + (isActive ? " active" : "")}
                    style={isActive ? {background:"#F0F7FF", borderColor:"#BFDBFE"} : {background:"#fff"}}
                    onClick={() => navigate(`/lesson/${s._id}`)}>
                    <div className="lesson-num" style={isActive ? {background:"var(--primary)", borderColor:"var(--primary)", color:"#fff"} : {}}>
                      {i+1}
                    </div>
                    <div className="lesson-info">
                      <div className="lesson-title" style={isActive ? {color:"#1E40AF"} : {}}>{s.title}</div>
                      <div className="lesson-meta">{s.duration || 15} Mins</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{padding:20, borderTop:"1px solid #E2E8F0", background:"#F8FAFC"}}>
             <div style={{fontSize:12, color:"#64748B", textAlign:"center", fontWeight:600}}>Academic Evaluation Engine v2.1</div>
          </div>
        </div>

        <div className="lesson-main-panel">
          <div style={{padding:"32px 40px", borderBottom:"1px solid #F1F5F9", background:"#fff"}}>
            <h1 style={{fontSize:28, fontWeight:900, color:"#0F172A", marginBottom:4, letterSpacing:"-0.02em"}}>{lesson.title}</h1>
            <div style={{display:"flex", gap:12, alignItems:"center", marginTop:16}}>
               <span className="badge badge-blue">Lesson Module</span>
               <span className="badge badge-gray">{lesson.duration || 15} Minutes</span>
            </div>
          </div>

          <div className="lesson-content-area">
            {lesson.content ? (
              <div className="lesson-content-text">
                {lesson.content.split('\n').map((para, i) => para.trim() && <p key={i}>{para}</p>)}
              </div>
            ) : (
              <div style={{textAlign:"center", padding:60, background:"#F8FAFC", borderRadius:20, border:"2px dashed #E2E8F0"}}>
                <div style={{fontSize:40, marginBottom:16}}>ðŸ“–</div>
                <h3 style={{fontSize:18, fontWeight:800, color:"#1E293B", marginBottom:8}}>Digital Module</h3>
                <p style={{color:"#64748B", fontSize:14}}>This module primarily consists of downloadable resources and practical missions. Explore the attachments below.</p>
              </div>
            )}

            {lesson.resources?.length > 0 && (
              <div style={{marginTop:48}}>
                <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:20}}>
                   <h3 style={{fontSize:18, fontWeight:900, color:"#0F172A"}}>Learning Materials</h3>
                   <span style={{fontSize:13, color:"#94A3B8"}}>{lesson.resources.length} available</span>
                </div>
                <div className="resource-list">
                  {lesson.resources.map((r, i) => (
                    <div className="resource-item" key={r._id || i}>
                      <div className="resource-item-left">
                        <div className={"resource-type-icon " + (r.type || "other")}>{typeIcon(r.type)}</div>
                        <div>
                          <div className="resource-name">{r.name}</div>
                          <div className="resource-type">{r.type || "resource"}</div>
                        </div>
                      </div>
                      <div style={{display:"flex", gap:10}}>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleToggleSaveResource(String(r._id))}
                          style={{padding: "8px 16px", fontSize:13}}
                        >
                          {savedResources.includes(String(r._id)) ? "Saved" : "Save"}
                        </button>
                        <button className="btn btn-secondary" onClick={() => setViewer(r)} style={{padding: "8px 16px", fontSize:13}}>
                          Preview Content
                        </button>
                        {r.isDownloadable && (
                          (() => {
                            const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
                            const token = localStorage.getItem("token");
                            const downloadUrl = `${API_BASE_URL}/lessons/${id}/resources/${r._id}/download?download=true${token ? `&token=${encodeURIComponent(token)}` : ''}`;
                            return (
                              <a
                                className="btn btn-primary"
                                href={downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{padding: "8px 16px", fontSize:13}}
                              >
                                Download
                              </a>
                            );
                          })()
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{padding:"24px 40px", borderTop:"1px solid #F1F5F9", background:"#F1F5F9", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div style={{display:"flex", gap:12}}>
              {prev && (
                <button className="btn btn-secondary" onClick={() => navigate(`/lesson/${prev._id}`)} style={{background:"#fff"}}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                  Previous Module
                </button>
              )}
              {next && (
                <button className="btn btn-secondary" onClick={() => navigate(`/lesson/${next._id}`)} style={{background:"#fff"}}>
                  Next Module
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              )}
            </div>
            
            {completed ? (
              <div className="badge badge-green" style={{padding:"12px 24px", borderRadius:12, fontSize:14, boxShadow:"0 4px 10px rgba(16,185,129,0.1)"}}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" style={{marginRight:8}}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                Module Completed
              </div>
            ) : (
              <button className="btn btn-success" onClick={handleComplete} style={{padding:"12px 28px", boxShadow:"0 4px 12px rgba(16,185,129,0.2)"}}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Mark as Finished
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
