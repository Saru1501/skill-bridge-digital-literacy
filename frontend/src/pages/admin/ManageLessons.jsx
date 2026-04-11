import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCourseById, getLessons, addLesson, updateLesson, deleteLesson } from "../../services/api";

const EMPTY = { title:"", description:"", content:"", order:"", duration:"" };

export default function ManageLessons() {
  const { courseId } = useParams();
  const navigate     = useNavigate();
  const [course,  setCourse]  = useState(null);
  const [lessons, setLessons] = useState([]);
  const [form,    setForm]    = useState(EMPTY);
  const [editId,  setEditId]  = useState(null);
  const [show,    setShow]    = useState(false);
  const [alert,   setAlert]   = useState({ msg:"", type:"" });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  const flash = (msg, type="success") => { setAlert({msg,type}); setTimeout(()=>setAlert({msg:"",type:""}),3500); };

  const load = async () => {
    setLoading(true);
    try {
      const [cRes, lRes] = await Promise.all([getCourseById(courseId), getLessons(courseId)]);
      setCourse(cRes.data.data);
      setLessons(lRes.data.data || []);
    } catch { flash("Failed to load lessons","error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [courseId]);

  const openAdd  = () => { setForm({ ...EMPTY, order: lessons.length + 1 }); setEditId(null); setShow(true); };
  const openEdit = (l) => {
    setForm({ title: l.title, description: l.description||"", content: l.content||"", order: l.order, duration: l.duration||"" });
    setEditId(l._id); setShow(true);
  };
  const close = () => setShow(false);

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order)||1, duration: Number(form.duration)||0 };
      if (editId) await updateLesson(editId, payload);
      else        await addLesson(courseId, payload);
      flash(editId ? "Lesson updated successfully." : "Lesson added successfully.");
      close(); load();
    } catch (err) {
      flash(err?.response?.data?.message || "Failed to save lesson","error");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete lesson "${title}"? All its resources will also be removed from Cloudinary.`)) return;
    try { await deleteLesson(id); flash("Lesson deleted."); load(); }
    catch { flash("Delete failed","error"); }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div style={{marginBottom:20}}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate("/admin/courses")}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          Back to Courses
        </button>
      </div>

      <div className="section-header">
        <div>
          <h1 className="section-title">Lessons</h1>
          <p className="section-sub">Course: <strong>{course?.title}</strong> &mdash; {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Add Lesson
        </button>
      </div>

      {alert.msg && <div className={"alert alert-"+alert.type}>{alert.msg}</div>}

      {/* Add / Edit Modal */}
      {show && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal-box" style={{maxWidth:620}} onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId ? "Edit Lesson" : "Add New Lesson"}</h3>
              <button className="modal-close" onClick={close}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={submit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Lesson Title *</label>
                  <input className="form-control" value={form.title}
                    onChange={e=>setForm(f=>({...f,title:e.target.value}))}
                    placeholder="e.g. Introduction to Computers" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Short Description</label>
                  <input className="form-control" value={form.description}
                    onChange={e=>setForm(f=>({...f,description:e.target.value}))}
                    placeholder="Brief summary shown in lesson list" />
                </div>
                <div className="form-group">
                  <label className="form-label">Lesson Content / Notes</label>
                  <textarea className="form-control" rows={6} value={form.content}
                    onChange={e=>setForm(f=>({...f,content:e.target.value}))}
                    placeholder="Write lesson notes, instructions, or study material here..." />
                  <p style={{fontSize:12,color:"#94A3B8",marginTop:4}}>
                    You can attach PDFs and YouTube videos in the Resources section after saving.
                  </p>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Order Number</label>
                    <input className="form-control" type="number" min="1" value={form.order}
                      onChange={e=>setForm(f=>({...f,order:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duration (minutes)</label>
                    <input className="form-control" type="number" min="0" value={form.duration}
                      onChange={e=>setForm(f=>({...f,duration:e.target.value}))} placeholder="0" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : editId ? "Update Lesson" : "Add Lesson"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson list */}
      {lessons.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <h3>No lessons yet</h3>
            <p>Add your first lesson to build this course.</p>
            <button className="btn btn-primary" onClick={openAdd}>Add First Lesson</button>
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{width:60}}>#</th>
                <th>Title</th>
                <th>Duration</th>
                <th>Resources</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map(l => (
                <tr key={l._id}>
                  <td>
                    <div style={{width:32,height:32,borderRadius:"50%",background:"#DBEAFE",color:"#1D4ED8",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13}}>
                      {l.order}
                    </div>
                  </td>
                  <td>
                    <div style={{fontWeight:600,color:"#0F172A"}}>{l.title}</div>
                    {l.description && <div style={{fontSize:12,color:"#94A3B8",marginTop:2}}>{l.description}</div>}
                  </td>
                  <td style={{color:"#64748B",fontSize:13}}>
                    {l.duration ? `${l.duration} min` : <span style={{color:"#CBD5E1"}}>&#8212;</span>}
                  </td>
                  <td>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                      {l.resources?.filter(r=>r.type==="pdf").length > 0 && (
                        <span className="badge badge-red" style={{background:"#FEE2E2",color:"#B91C1C"}}>
                          {l.resources.filter(r=>r.type==="pdf").length} PDF
                        </span>
                      )}
                      {l.resources?.filter(r=>r.type==="video").length > 0 && (
                        <span className="badge badge-blue">
                          {l.resources.filter(r=>r.type==="video").length} Video
                        </span>
                      )}
                      {l.resources?.filter(r=>!["pdf","video"].includes(r.type)).length > 0 && (
                        <span className="badge badge-gray">
                          {l.resources.filter(r=>!["pdf","video"].includes(r.type)).length} Other
                        </span>
                      )}
                      {(!l.resources || l.resources.length === 0) && (
                        <span style={{fontSize:12,color:"#CBD5E1"}}>No resources</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="actions">
                      <Link to={`/admin/lessons/${l._id}/resources`} className="btn btn-secondary btn-sm">
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                        Resources
                      </Link>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(l)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(l._id, l.title)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick tip */}
      {lessons.length > 0 && (
        <div style={{marginTop:20,padding:"14px 18px",background:"#F0FDF4",border:"1px solid #86EFAC",borderRadius:10,fontSize:13,color:"#15803D"}}>
          <strong>Tip:</strong> Click <strong>Resources</strong> on any lesson to upload PDFs via Cloudinary or add YouTube video links.
          You can add unlimited lessons and resources per course.
        </div>
      )}
    </div>
  );
}
