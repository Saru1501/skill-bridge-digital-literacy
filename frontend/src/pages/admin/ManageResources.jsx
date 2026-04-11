import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLessonById, uploadResource, deleteResource } from "../../services/api";

const TYPES = ["pdf","video","slides","other"];

export default function ManageResources() {
  const { lessonId } = useParams();
  const navigate     = useNavigate();
  const [lesson,    setLesson]    = useState(null);
  const [file,      setFile]      = useState(null);
  const [form,      setForm]      = useState({ name:"", type:"pdf", isDownloadable:true });
  const [uploading, setUploading] = useState(false);
  const [alert,     setAlert]     = useState({ msg:"", type:"" });
  const [loading,   setLoading]   = useState(true);

  const flash = (msg, type="success") => { setAlert({msg,type}); setTimeout(()=>setAlert({msg:"",type:""}),4000); };

  const load = async () => {
    try { const r = await getLessonById(lessonId); setLesson(r.data.data); }
    catch { flash("Failed to load lesson","error"); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [lessonId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { flash("Please select a file to upload","error"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("name", form.name || file.name);
      fd.append("type", form.type);
      fd.append("isDownloadable", form.isDownloadable);
      await uploadResource(lessonId, fd);
      flash("Resource uploaded successfully via Cloudinary!");
      setFile(null); setForm({ name:"", type:"pdf", isDownloadable:true });
      document.getElementById("file-input").value = "";
      load();
    } catch (err) { flash(err?.response?.data?.message || "Upload failed","error"); } finally { setUploading(false); }
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm("Delete this resource?")) return;
    try { await deleteResource(lessonId, resourceId); flash("Resource deleted."); load(); }
    catch { flash("Delete failed","error"); }
  };

  const typeIcon = (type) => {
    const icons = {
      pdf:    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
      video:  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>,
      slides: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>,
      other:  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>,
    };
    return icons[type] || icons.other;
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div style={{marginBottom:20}}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          Back to Lessons
        </button>
      </div>

      <div className="section-header">
        <div>
          <h1 className="section-title">Resources</h1>
          <p className="section-sub">Lesson: {lesson?.title} â€” {lesson?.resources?.length||0} files uploaded</p>
        </div>
      </div>

      {alert.msg && <div className={"alert alert-"+alert.type}>{alert.msg}</div>}

      <div className="card" style={{marginBottom:24}}>
        <div className="card-header">
          <h3 className="card-title">Upload Resource</h3>
          <span className="badge badge-purple">Cloudinary Storage</span>
        </div>
        <div className="card-body">
          <p style={{fontSize:13,color:"#64748B",marginBottom:20}}>Supports PDF, video, slides and other files. Files are stored securely via Cloudinary CDN.</p>
          <form onSubmit={handleUpload}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
              <div className="form-group">
                <label className="form-label">Display Name</label>
                <input className="form-control" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Leave blank to use filename" />
              </div>
              <div className="form-group">
                <label className="form-label">Resource Type</label>
                <select className="form-control" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                  {TYPES.map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group" style={{marginBottom:16}}>
              <label className="form-label">File *</label>
              <input id="file-input" className="form-control" type="file" onChange={e=>setFile(e.target.files[0])} required />
            </div>
            <div className="form-group" style={{marginBottom:20}}>
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:14,fontWeight:500}}>
                <input type="checkbox" checked={form.isDownloadable} onChange={e=>setForm(f=>({...f,isDownloadable:e.target.checked}))} style={{width:16,height:16}} />
                Allow students to download this resource
              </label>
            </div>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? "Uploading to Cloudinary..." : "Upload Resource"}
            </button>
          </form>
        </div>
      </div>

      <div className="section-header"><h2 style={{fontSize:17,fontWeight:700}}>Uploaded Resources ({lesson?.resources?.length||0})</h2></div>

      {!lesson?.resources?.length ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-icon"><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg></div>
          <h3>No resources yet</h3><p>Upload your first resource using the form above.</p>
        </div></div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Type</th><th>Name</th><th>Downloadable</th><th>Preview</th><th>Actions</th></tr></thead>
            <tbody>
              {lesson.resources.map(r => (
                <tr key={r._id}>
                  <td><div className={"resource-type-icon "+(r.type||"other")}>{typeIcon(r.type)}</div></td>
                  <td><span style={{fontWeight:600}}>{r.name}</span></td>
                  <td><span className={"badge "+(r.isDownloadable?"badge-green":"badge-gray")}>{r.isDownloadable?"Yes":"No"}</span></td>
                  <td><a href={r.url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">Open Link</a></td>
                  <td><button className="btn btn-danger btn-sm" onClick={()=>handleDelete(r._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
