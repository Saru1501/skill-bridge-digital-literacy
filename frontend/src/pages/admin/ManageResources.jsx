import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLessonById, uploadResource, deleteResource } from "../../services/api";

const TYPES = ["pdf","video","slides","other"];

function typeIcon(type) {
  const icons = {
    pdf:    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
    video:  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>,
    slides: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>,
    other:  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>,
  };
  return icons[type] || icons.other;
}

function formatSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + " KB";
  return (bytes/1024/1024).toFixed(1) + " MB";
}

export default function ManageResources() {
  const { lessonId } = useParams();
  const navigate     = useNavigate();
  const [lesson,    setLesson]    = useState(null);
  const [file,      setFile]      = useState(null);
  const [form,      setForm]      = useState({ name:"", type:"pdf", isDownloadable:true });
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [alert,     setAlert]     = useState({ msg:"", type:"" });
  const [loading,   setLoading]   = useState(true);
  const [preview,   setPreview]   = useState(null);

  const flash = (msg, type="success") => { setAlert({msg,type}); setTimeout(()=>setAlert({msg:"",type:""}),4000); };

  const load = async () => {
    setLoading(true);
    try { const r = await getLessonById(lessonId); setLesson(r.data.data); }
    catch { flash("Failed to load lesson","error"); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [lessonId]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    // Auto-detect type
    if (f) {
      const ext = f.name.split(".").pop()?.toLowerCase();
      if (["pdf"].includes(ext)) setForm(fm => ({ ...fm, type: "pdf" }));
      else if (["mp4", "webm", "avi", "mov"].includes(ext)) setForm(fm => ({ ...fm, type: "video" }));
      else if (["ppt", "pptx", "key"].includes(ext)) setForm(fm => ({ ...fm, type: "slides" }));
      else if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) setForm(fm => ({ ...fm, type: "image" }));
      else setForm(fm => ({ ...fm, type: "other" }));
      if (!form.name) setForm(fm => ({ ...fm, name: f.name.replace(/\.[^/.]+$/, "") }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { flash("Please select a file to upload","error"); return; }
    setUploading(true); setProgress(0);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("name", form.name || file.name);
      fd.append("type", form.type);
      fd.append("isDownloadable", form.isDownloadable);

      // Simulate progress while Cloudinary uploads
      const timer = setInterval(() => setProgress(p => Math.min(p+8, 90)), 300);
      await uploadResource(lessonId, fd);
      clearInterval(timer); setProgress(100);

      setTimeout(() => setProgress(0), 800);
      flash("Resource uploaded successfully to Cloudinary!");
      setFile(null); setForm({ name:"", type:"pdf", isDownloadable:true });
      document.getElementById("file-input").value = "";
      load();
    } catch (err) { flash(err?.response?.data?.message || "Upload failed. Check Cloudinary credentials.","error"); setProgress(0); }
    finally { setUploading(false); }
  };

  const handleDelete = async (resourceId, resourceName) => {
    if (!window.confirm(`Delete "${resourceName}"? This will also remove it from Cloudinary.`)) return;
    try { await deleteResource(lessonId, resourceId); flash("Resource deleted from Cloudinary."); load(); }
    catch { flash("Delete failed","error"); }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 32 }}>
      <div style={{ background: '#1E293B', borderRadius: 18, padding: 24, marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontWeight: 700, fontSize: 28 }}>Manage Resources</h1>
      </div>

      {/* Preview modal */}

      {preview && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:2000,display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px",background:"#0F172A"}}>
            <span style={{color:"#fff",fontWeight:600}}>{preview.name}</span>
            <button onClick={()=>setPreview(null)} style={{background:"rgba(255,255,255,0.1)",border:"none",color:"#fff",padding:"6px 12px",borderRadius:6,cursor:"pointer",fontWeight:600}}>Close</button>
          </div>
          <div style={{flex:1,overflow:"hidden",padding:16,display:"flex",alignItems:"center",justifyContent:"center"}}>
            {/* PDF Preview (Cloudinary fl_inline only for PDFs) */}
            {preview.type === "pdf" ? (
              <iframe
                src={
                  preview.url && preview.url.includes("cloudinary")
                    ? preview.url.replace("/upload/", "/upload/fl_inline/")
                    : `${process.env.REACT_APP_API_URL || "http://localhost:3001/api"}/lessons/${lessonId}/resources/${preview._id}/download`
                }
                style={{width:"100%",height:"100%",border:"none",borderRadius:8,background:"#fff"}}
                title={preview.name}
              />
            ) :
            // Video Preview
            (preview.type === "video" ? (
              <video controls autoPlay style={{maxWidth:"100%",maxHeight:"100%",borderRadius:8,background:"#000"}}>
                <source src={preview.url}/> Your browser does not support video.
              </video>
            ) :
            // Image Preview (no fl_inline)
            (preview.type === "image" && preview.url ? (
              <img src={preview.url} alt={preview.name} style={{maxWidth:"100%",maxHeight:"80vh",borderRadius:8,background:"#fff",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}} />
            ) :
            // Fallback for other types
            (
              <div style={{textAlign:"center",color:"#fff"}}>
                <p style={{marginBottom:16,color:"#94A3B8"}}>No preview for this file type.</p>
                <a href={preview.url} target="_blank" rel="noreferrer" style={{padding:"10px 20px",background:"#2563EB",color:"#fff",borderRadius:8,textDecoration:"none"}}>Open File</a>
              </div>
            )))}
          </div>
        </div>
      )}

      <div style={{marginBottom:20}}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          Back to Lessons
        </button>
      </div>

      <div className="section-header">
        <div>
          <h1 className="section-title">Manage Resources</h1>
          <p className="section-sub">Lesson: {lesson?.title} &mdash; {lesson?.resources?.length || 0} files on Cloudinary</p>
        </div>
      </div>

      {alert.msg && <div className={"alert alert-"+alert.type}>{alert.msg}</div>}

      {/* Upload Card */}
      <div className="card" style={{marginBottom:24}}>
        <div className="card-header">
          <h3 className="card-title">Upload Resource</h3>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span className="badge badge-purple">Cloudinary CDN</span>
            <span className="badge badge-gray">Auto type detection</span>
          </div>
        </div>
        <div className="card-body">
          <div style={{background:"#F0FDF4",border:"1px solid #86EFAC",borderRadius:8,padding:"10px 14px",marginBottom:20,fontSize:13,color:"#15803D"}}>
            <strong>Cloudinary Integration Active:</strong> Files are uploaded to <code>skillbridge/resources</code> folder and served via global CDN. Supported: PDF, MP4, WebM, PPT, PNG, JPG and more.
          </div>

          <form onSubmit={handleUpload}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
              <div className="form-group">
                <label className="form-label">Display Name</label>
                <input className="form-control" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Auto-filled from filename" />
              </div>
              <div className="form-group">
                <label className="form-label">Resource Type</label>
                <select className="form-control" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                  {TYPES.map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group" style={{marginBottom:16}}>
              <label className="form-label">Select File *</label>
              <input id="file-input" className="form-control" type="file"
                accept=".pdf,.mp4,.webm,.avi,.mov,.ppt,.pptx,.key,.png,.jpg,.jpeg,.gif,.doc,.docx"
                onChange={handleFileChange} required />
              {file && (
                <p style={{fontSize:12,color:"#64748B",marginTop:4}}>
                  Selected: <strong>{file.name}</strong> ({formatSize(file.size)})
                </p>
              )}
            </div>

            <div className="form-group" style={{marginBottom:20}}>
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:14,fontWeight:500,color:"#374151"}}>
                <input type="checkbox" checked={form.isDownloadable} onChange={e=>setForm(f=>({...f,isDownloadable:e.target.checked}))} style={{width:16,height:16,accentColor:"#2563EB"}} />
                Allow students to download this resource
              </label>
            </div>

            {uploading && progress > 0 && (
              <div style={{marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:12,color:"#64748B"}}>
                  <span>Uploading to Cloudinary...</span>
                  <span>{progress}%</span>
                </div>
                <div className="progress-wrap"><div className="progress-bar" style={{width:progress+"%",transition:"width 0.3s"}}></div></div>
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={uploading} style={{minWidth:180}}>
              {uploading ? (
                <><span style={{width:14,height:14,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid white",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite",marginRight:8}}></span>Uploading...</>
              ) : (
                <><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>Upload to Cloudinary</>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Resource list */}
      <div className="section-header">
        <h2 style={{fontSize:17,fontWeight:700}}>Uploaded Resources ({lesson?.resources?.length || 0})</h2>
      </div>

      {!lesson?.resources?.length ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-icon"><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg></div>
          <h3>No resources uploaded</h3>
          <p>Use the form above to upload PDFs, videos, or slides.</p>
        </div></div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Type</th><th>Name</th><th>Size</th><th>Downloadable</th><th>Actions</th></tr></thead>
            <tbody>
              {lesson.resources.map(r => (
                <tr key={r._id}>
                  <td>
                    <div className={"resource-type-icon " + (r.type||"other")} style={{display:"flex",alignItems:"center",justifyContent:"center",width:36,height:36,borderRadius:8}}>
                      {typeIcon(r.type)}
                    </div>
                  </td>
                  <td>
                    <div style={{fontWeight:600}}>{r.name}</div>
                    <div style={{fontSize:11,color:"#94A3B8",marginTop:2}}>{r.type || "file"}</div>
                  </td>
                  <td style={{color:"#64748B",fontSize:13}}>{formatSize(r.size)}</td>
                  <td><span className={"badge "+(r.isDownloadable?"badge-green":"badge-gray")}>{r.isDownloadable?"Yes":"No"}</span></td>
                  <td>
                    <div style={{display:"flex",gap:6}}>
                      <button className="btn btn-secondary btn-sm" onClick={()=>setPreview(r)}>
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        Preview
                      </button>
                      <a href={r.url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                        Open
                      </a>
                      <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(r._id, r.name)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cloudinary info box */}
      <div style={{marginTop:24,padding:"16px 20px",background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:10,fontSize:13}}>
        <h4 style={{fontWeight:700,color:"#1D4ED8",marginBottom:8}}>How Cloudinary Integration Works</h4>
        <ol style={{paddingLeft:20,color:"#374151",lineHeight:2}}>
          <li>You select a file in the form above.</li>
          <li>The file is sent to the backend (<code>POST /api/lessons/:id/resources</code>) as multipart form data.</li>
          <li>The backend uses the <strong>Cloudinary Node.js SDK</strong> to upload the file to the <code>skillbridge/resources</code> folder.</li>
          <li>Cloudinary returns a secure URL and public ID which are stored in MongoDB.</li>
          <li>Students access the resource via the Cloudinary CDN URL — globally fast and reliable.</li>
        </ol>
        <p style={{marginTop:8,color:"#64748B"}}>
          <strong>Environment variables needed:</strong> <code>CLOUDINARY_CLOUD_NAME</code>, <code>CLOUDINARY_API_KEY</code>, <code>CLOUDINARY_API_SECRET</code>
        </p>
      </div>
    </div>
  );
}
