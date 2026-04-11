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
    try {
      const [cRes, lRes] = await Promise.all([getCourseById(courseId), getLessons(courseId)]);
      setCourse(cRes.data.data); setLessons(lRes.data.data||[]);
    } catch { flash("Failed to load","error"); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [courseId]);

  const openAdd  = () => { setForm({...EMPTY, order:lessons.length+1}); setEditId(null); setShow(true); };
  const openEdit = (l) => { setForm({title:l.title,description:l.description||"",content:l.content||"",order:l.order,duration:l.duration||""}); setEditId(l._id); setShow(true); };
  const close    = () => setShow(false);

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, order:Number(form.order)||1, duration:Number(form.duration)||0 };
      if (editId) await updateLesson(editId, payload); else await addLesson(courseId, payload);
      flash(editId ? "Lesson updated." : "Lesson added."); close(); load();
    } catch (err) { flash(err?.response?.data?.message||"Failed","error"); } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete lesson "${title}"?`)) return;
    try { await deleteLesson(id); flash("Lesson deleted."); load(); } catch { flash("Delete failed","error"); }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div style={{marginBottom:20,display:"flex",alignItems:"center",gap:8}}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate("/admin/courses")}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          Back to Courses
        </button>
      </div>

      <div className="section-header">
        <div>
          <h1 className="section-title">Lessons â€” {course?.title}</h1>
          <p className="section-sub">{lessons.length} lessons in this course</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Add Lesson
        </button>
      </div>

      {alert.msg && <div className={"alert alert-"+alert.type}>{alert.msg}</div>}

      {show && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal-box" style={{maxWidth:600}} onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId?"Edit Lesson":"Add New Lesson"}</h3>
              <button className="modal-close" onClick={close}><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <form onSubmit={submit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Lesson Title *</label>
                  <input className="form-control" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Introduction to Computers" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input className="form-control" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Brief description of this lesson" />
                </div>
                <div className="form-group">
                  <label className="form-label">Content</label>
                  <textarea className="form-control" rows={6} value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} placeholder="Lesson content, notes, or instructions..." />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Order Number</label>
                    <input className="form-control" type="number" min="1" value={form.order} onChange={e=>setForm(f=>({...f,order:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duration (minutes)</label>
                    <input className="form-control" type="number" min="0" value={form.duration} onChange={e=>setForm(f=>({...f,duration:e.target.value}))} placeholder="0" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving?"Saving...":editId?"Update Lesson":"Add Lesson"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {lessons.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-icon"><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg></div>
          <h3>No lessons yet</h3><p>Add your first lesson to get started.</p>
          <button className="btn btn-primary" onClick={openAdd}>Add First Lesson</button>
        </div></div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Order</th><th>Title</th><th>Duration</th><th>Resources</th><th>Actions</th></tr></thead>
            <tbody>
              {lessons.map(l => (
                <tr key={l._id}>
                  <td><div style={{width:30,height:30,borderRadius:"50%",background:"#DBEAFE",color:"#1D4ED8",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13}}>{l.order}</div></td>
                  <td><div style={{fontWeight:600}}>{l.title}</div><div style={{fontSize:12,color:"#94A3B8",marginTop:2}}>{l.description}</div></td>
                  <td>{l.duration ? `${l.duration} min` : "â€”"}</td>
                  <td><span className="badge badge-blue">{l.resources?.length||0} files</span></td>
                  <td>
                    <div className="actions">
                      <Link to={`/admin/lessons/${l._id}/resources`} className="btn btn-secondary btn-sm">Resources</Link>
                      <button className="btn btn-secondary btn-sm" onClick={()=>openEdit(l)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(l._id,l.title)}>Delete</button>
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
