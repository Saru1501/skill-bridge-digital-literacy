import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyEnrollments, getCourseProgress, getLessons, syncOffline } from "../../services/api";

const OL_KEY = (courseId) => `sb_offline_${courseId}`;
const getOfflineCache = (courseId) => {
  try { return JSON.parse(localStorage.getItem(OL_KEY(courseId)) || "{}"); } catch { return {}; }
};

function typeIcon(type) {
  if (type==="pdf")    return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>;
  if (type==="video")  return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>;
  if (type==="slides") return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>;
  return <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>;
}

export default function Downloads() {
  const [downloads,    setDownloads]    = useState([]);
  const [offlinePending, setOfflinePending] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [isOnline,     setIsOnline]     = useState(navigator.onLine);
  const [alert,        setAlert]        = useState({ msg:"", type:"" });
  const [syncing,      setSyncing]      = useState(false);

  const flash = (msg, type="success") => { setAlert({msg,type}); setTimeout(()=>setAlert({msg:"",type:""}),3500); };

  useEffect(() => {
    const on  = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on); window.addEventListener("offline", off);
    return () => { window.removeEventListener("online",on); window.removeEventListener("offline",off); };
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const enrRes = await getMyEnrollments();
        const enrollments = enrRes.data.data || [];
        const all = []; const pending = [];

        await Promise.all(enrollments.map(async e => {
          try {
            const [pRes, lRes] = await Promise.all([getCourseProgress(e.course._id), getLessons(e.course._id)]);
            const prog    = pRes.data.data;
            const lessons = lRes.data.data || [];

            // Real downloads from backend
            (prog?.downloadedResources || []).forEach(url => {
              lessons.forEach(l => {
                const res = l.resources?.find(r => r.url === url);
                if (res) all.push({ ...res, courseName: e.course.title, lessonName: l.title, courseId: e.course._id, lessonId: l._id });
              });
            });

            // Offline pending progress
            const cache = getOfflineCache(e.course._id);
            if (cache.pendingLessons?.length) {
              pending.push({ courseId: e.course._id, courseName: e.course.title, count: cache.pendingLessons.length });
            }
          } catch {}
        }));

        setDownloads(all);
        setOfflinePending(pending);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const handleSync = async (courseId, courseName) => {
    const cache = getOfflineCache(courseId);
    if (!cache.pendingLessons?.length) return;
    setSyncing(true);
    try {
      await syncOffline(courseId, cache.pendingLessons);
      localStorage.setItem(`sb_offline_${courseId}`, JSON.stringify({ ...cache, pendingLessons: [] }));
      setOfflinePending(p => p.filter(x => x.courseId !== courseId));
      flash(`Synced offline progress for "${courseName}"`);
    } catch { flash("Sync failed. Try again when online.","error"); } finally { setSyncing(false); }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 32 }}>
      <div style={{ background: '#1E293B', borderRadius: 18, padding: 24, marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontWeight: 700, fontSize: 28 }}>Downloads</h1>
      </div>

      {alert.msg && <div className={"alert alert-"+alert.type}>{alert.msg}</div>}

      {/* Offline pending sync */}
      {offlinePending.length > 0 && (
        <div style={{background:"#FEF3C7",border:"1px solid #FCD34D",borderRadius:10,padding:"16px 20px",marginBottom:24}}>
          <h4 style={{fontWeight:700,color:"#92400E",marginBottom:12,fontSize:14}}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{display:"inline",marginRight:6}}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            Offline Progress Pending Sync ({offlinePending.reduce((a,p)=>a+p.count,0)} lessons)
          </h4>
          {offlinePending.map(p => (
            <div key={p.courseId} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #FDE68A"}}>
              <div>
                <span style={{fontWeight:600,fontSize:14}}>{p.courseName}</span>
                <span style={{color:"#92400E",fontSize:12,marginLeft:8}}>{p.count} lesson{p.count>1?"s":""} completed offline</span>
              </div>
              {isOnline ? (
                <button className="btn btn-warning btn-sm" onClick={()=>handleSync(p.courseId,p.courseName)} disabled={syncing}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  {syncing ? "Syncing..." : "Sync Now"}
                </button>
              ) : (
                <span style={{fontSize:12,color:"#D97706"}}>Reconnect to sync</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Offline info */}
      <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:10,padding:"14px 18px",marginBottom:24,fontSize:13}}>
        <h4 style={{fontWeight:700,color:"#1D4ED8",marginBottom:6}}>How Offline Access Works</h4>
        <p style={{color:"#374151",lineHeight:1.7}}>
          When you click <strong>Download</strong> on a lesson resource, it opens via Cloudinary CDN and the download is tracked.
          When you mark a lesson complete while <strong>offline</strong>, it is saved locally in your browser.
          When you reconnect, click <strong>Sync</strong> to push your progress to the server.
        </p>
      </div>

      {downloads.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            </div>
            <h3>No downloads yet</h3>
            <p>Open a lesson and click Download on any resource to see it here.</p>
            <Link to="/my-courses" className="btn btn-primary">Go to My Courses</Link>
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>File</th><th>Type</th><th>Course</th><th>Lesson</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {downloads.map((d, i) => (
                <tr key={i}>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div className={"resource-type-icon " + (d.type||"other")} style={{width:36,height:36,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {typeIcon(d.type)}
                      </div>
                      <span style={{fontWeight:600}}>{d.name}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-blue">{d.type || "file"}</span></td>
                  <td style={{color:"#475569",fontSize:13}}>{d.courseName}</td>
                  <td style={{color:"#475569",fontSize:13}}>{d.lessonName}</td>
                  <td>
                    <div style={{display:"flex",gap:6}}>
                      <a href={d.url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">Open</a>
                      <a href={d.url} download className="btn btn-primary btn-sm">
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                        Download
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
