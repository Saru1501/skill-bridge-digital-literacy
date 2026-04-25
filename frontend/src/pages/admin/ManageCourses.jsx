import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCourses, createCourse, updateCourse, deleteCourse, togglePublish } from "../../services/api";

const CATS  = ["Basic IT","Internet Safety","Online Jobs","Digital Payments","Digital Tools"];
const LVLS  = ["beginner","intermediate","advanced"];
const EMPTY = { title:"", description:"", category:"Basic IT", level:"beginner", tags:"" };

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [form,    setForm]    = useState(EMPTY);
  const [editId,  setEditId]  = useState(null);
  const [show,    setShow]    = useState(false);
  const [alert,   setAlert]   = useState({ msg:"", type:"" });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  // Filter states
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const flash = (msg, type="success") => { setAlert({msg,type}); setTimeout(()=>setAlert({msg:"",type:""}),3500); };
  const load  = async () => { try { const r = await getCourses({limit:100}); setCourses(r.data.data||[]); } catch {} setLoading(false); };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setShow(true); };
  const openEdit = (c) => { setForm({ title:c.title, description:c.description, category:c.category, level:c.level, tags:(c.tags||[]).join(",") }); setEditId(c._id); setShow(true); };
  const close    = () => setShow(false);

  const submit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, tags: form.tags.split(",").map(t=>t.trim()).filter(Boolean) };
      if (editId) await updateCourse(editId, payload); else await createCourse(payload);
      flash(editId ? "Course updated successfully." : "Course created successfully."); close(); load();
    } catch (err) { flash(err?.response?.data?.message || "Operation failed","error"); } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try { await deleteCourse(id); flash("Course deleted."); load(); } catch { flash("Delete failed","error"); }
  };

  const handlePublish = async (id) => {
    try { await togglePublish(id); flash("Course status updated."); load(); } catch { flash("Update failed","error"); }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  // Filtering logic
  const filteredCourses = courses.filter(c =>
    (!filterCategory || c.category === filterCategory) &&
    (!filterLevel || c.level === filterLevel) &&
    (!filterStatus || (filterStatus === "published" ? c.isPublished : !c.isPublished))
  );

  return (
    <div style={{ background: '#fff', minHeight: '100vh', padding: 32 }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1E293B', borderRadius: 18, padding: 24, marginBottom: 32 }}>
        <h1 style={{ color: '#fff', fontWeight: 700, fontSize: 28, margin: 0 }}>Manage Courses</h1>
        <button
          onClick={openAdd}
          style={{
            background: '#006ff6',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            border: 'none',
            borderRadius: 12,
            padding: '12px 28px',
            boxShadow: '0 2px 8px rgba(96,165,250,0.10)',
            cursor: 'pointer',
            transition: 'background 0.2s',
            outline: 'none',
            marginLeft: 24
          }}
        >
          + Create Course
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="form-control" style={{ minWidth: 160 }}>
          <option value="">All Categories</option>
          {CATS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className="form-control" style={{ minWidth: 140 }}>
          <option value="">All Levels</option>
          {LVLS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="form-control" style={{ minWidth: 140 }}>
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        {(filterCategory || filterLevel || filterStatus) && (
          <button className="btn btn-secondary" onClick={() => { setFilterCategory(""); setFilterLevel(""); setFilterStatus(""); }}>Clear Filters</button>
        )}
      </div>

      {alert.msg && <div className={"alert alert-"+alert.type}>{alert.msg}</div>}

      {show && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId ? "Edit Course" : "Add New Course"}</h3>
              <button className="modal-close" onClick={close}><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <form onSubmit={submit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Course Title *</label>
                  <input className="form-control" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Introduction to Digital Literacy" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea className="form-control" rows={3} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Course overview..." required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-control" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                      {CATS.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Level</label>
                    <select className="form-control" value={form.level} onChange={e=>setForm(f=>({...f,level:e.target.value}))}>
                      {LVLS.map(l=><option key={l} value={l}>{l.charAt(0).toUpperCase()+l.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <input className="form-control" value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))} placeholder="e.g. basics, beginner, IT" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving?"Saving...":editId?"Update Course":"Create Course"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Title</th><th>Category</th><th>Level</th><th>Lessons</th><th>Enrolled</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filteredCourses.length===0 && <tr><td colSpan={7} style={{textAlign:"center",color:"#94A3B8",padding:40}}>No courses found. Adjust your filters or click "Add Course" to create a new course.</td></tr>}
            {filteredCourses.map(c => (
              <tr key={c._id}>
                <td><div style={{fontWeight:600}}>{c.title}</div><div style={{fontSize:12,color:"#94A3B8",marginTop:2}}>{c.tags?.join(", ")}</div></td>
                <td><span className="badge badge-blue">{c.category}</span></td>
                <td style={{textTransform:"capitalize"}}>{c.level}</td>
                <td>{c.totalLessons}</td>
                <td>{c.enrollmentCount}</td>
                <td><span className={"badge "+(c.isPublished?"badge-green":"badge-yellow")}>{c.isPublished?"Published":"Draft"}</span></td>
                <td>
                  <div className="actions">
                    <Link to={`/admin/courses/${c._id}/lessons`} className="btn btn-secondary btn-sm">Lessons</Link>
                    <Link to={`/admin/assessment/course/${c._id}/missions`} className="btn btn-secondary btn-sm">Assessments</Link>
                    <button className={"btn btn-sm "+(c.isPublished?"btn-warning":"btn-success")} onClick={()=>handlePublish(c._id)}>{c.isPublished?"Unpublish":"Publish"}</button>
                    <button className="btn btn-secondary btn-sm" onClick={()=>openEdit(c)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(c._id,c.title)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
